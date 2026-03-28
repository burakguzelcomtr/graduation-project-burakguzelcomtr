const Lesson = require('../models/lesson')
const ClassGroup = require('../models/class-group')
const Unit = require('../models/unit')

class LessonManager {
  static buildLessonTypeFilter(type) {
    if (!type) {
      return null
    }

    if (type === 'main') {
      return {
        $or: [
          { type: 'main' },
          { lessonType: 'main' },
          {
            $and: [{ type: { $exists: false } }, { lessonType: { $exists: false } }],
          },
        ],
      }
    }

    return {
      $or: [{ type }, { lessonType: type }],
    }
  }

  static async buildLessonFilter({ classGroupId, type } = {}) {
    const filters = []
    const typeFilter = this.buildLessonTypeFilter(type)

    if (typeFilter) {
      filters.push(typeFilter)
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
      return {}
    }

    if (filters.length === 1) {
      return filters[0]
    }

    return { $and: filters }
  }

  static async getLessonById(lessonId) {
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
      const error = new Error('Lesson not found')
      error.status = 404
      throw error
    }
    return lesson
  }

  static async buildLessonWithUnits(lesson) {
    const units = await Unit.find({ lesson: lesson.id }).sort({ order: 1, createdAt: 1 })
    return {
      ...lesson.toObject(),
      units,
    }
  }

  static async getLessonWithUnits(lessonId) {
    const lesson = await this.getLessonById(lessonId)
    return this.buildLessonWithUnits(lesson)
  }

  static async getLessons({ classGroupId, type } = {}) {
    const filter = await this.buildLessonFilter({ classGroupId, type })
    return Lesson.find(filter).sort({ order: 1, createdAt: 1 })
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

  static async getLessonsByClassGroup({ classGroupId, type } = {}) {
    return this.getLessons({ classGroupId, type })
  }

  static async getLessonsWithUnits({ classGroupId, type } = {}) {
    const lessons = await this.getLessons({ classGroupId, type })
    return Promise.all(lessons.map(lesson => this.buildLessonWithUnits(lesson)))
  }

  static async getLessonsWithUnitsByClassGroup({ classGroupId, type } = {}) {
    const lessons = await this.getLessonsByClassGroup({ classGroupId, type })
    return Promise.all(lessons.map(lesson => this.buildLessonWithUnits(lesson)))
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
