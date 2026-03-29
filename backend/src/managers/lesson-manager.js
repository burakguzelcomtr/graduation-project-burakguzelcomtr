const Lesson = require('../models/lesson')
const ClassGroup = require('../models/class-group')
const Unit = require('../models/unit')

class LessonManager {
  static async getLessonById(lessonId) {
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
      const error = new Error('Lesson not found')
      error.status = 404
      throw error
    }
    return lesson
  }

  static async getLessonWithUnits(lessonOrId) {
    let lesson = lessonOrId

    if (typeof lessonOrId?.toObject !== 'function') {
      lesson = await this.getLessonById(lessonOrId)
    }

    const units = await Unit.find({ lesson: lesson.id }).sort({ order: 1, createdAt: 1 })
    return {
      ...lesson.toObject(),
      units,
    }
  }

  static async getLessonsWithUnits({ classGroupId, type = 'main' } = {}) {
    const lessons = await this.getLessons({ classGroupId, type })
    return Promise.all(lessons.map(lesson => this.getLessonWithUnits(lesson)))
  }

  static async getLessons({ classGroupId, type } = {}) {
    const filters = []

    if (type) {
      filters.push({ type })
    }

    if (classGroupId) {
      const classGroup = await ClassGroup.findById(classGroupId).select('grade')

      if (classGroup?.grade != null) {
        filters.push({
          $or: [{ classGroups: classGroupId }, { grade: classGroup.grade }],
        })
      } else {
        filters.push({ classGroups: classGroupId })
      }
    }

    if (filters.length === 0) {
      return Lesson.find().sort({ order: 1, createdAt: 1 })
    }

    if (filters.length === 1) {
      return Lesson.find(filters[0]).sort({ order: 1, createdAt: 1 })
    }

    return Lesson.find({ $and: filters }).sort({ order: 1, createdAt: 1 })
  }

  static async createLesson({ title, description, classGroups = [], type = 'main', order }) {
    if (!title) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    return Lesson.create({ title, description, classGroups, type, order })
  }

  static async getUnitById(unitId) {
    return Unit.findById(unitId)
  }

  static async getUnits() {
    return Unit.find().sort({ order: 1, createdAt: 1 })
  }

  static async createUnit({ title, items = [] }) {
    if (!title) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }
    const createdUnit = await Unit.create({ title, items })
    return createdUnit
  }

  static async getUnitsByLesson({ lessonId }) {
    await this.getLessonById(lessonId)
    return Unit.find({ lesson: lessonId }).sort({ order: 1, createdAt: 1 })
  }

  static async assignUnitToLesson({ lessonId, unitId, order = null }) {
    const lesson = await this.getLessonById(lessonId)
    const unit = await Unit.findById(unitId)

    if (!unit) {
      const error = new Error('Unit not found')
      error.status = 404
      throw error
    }

    if (unit.lesson && String(unit.lesson) !== String(lesson.id)) {
      const error = new Error('Unit already assigned to this lesson')
      error.status = 400
      throw error
    }

    const lessonUnitCount = await Unit.countDocuments({ lesson: lesson.id })
    unit.lesson = lesson.id
    unit.order = order ?? unit.order ?? lessonUnitCount + 1
    await unit.save()

    return lesson
  }
}

module.exports = LessonManager
