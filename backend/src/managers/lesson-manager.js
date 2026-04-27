const Lesson = require('../models/lesson')
const Unit = require('../models/unit')
const esref = require('../utils/esref.js')

class LessonManager {
  static async getLessonById(lessonId, withUnits = false) {
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
      const error = new Error('Lesson not found')
      error.status = 404
      throw error
    }
    if (withUnits) {
      return this.getLessonWithUnits(lesson)
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

  static async getLessons({ classGroup, type, withUnits = false } = {}) {
    const query = type ? { type } : {}

    let lessons = await Lesson.find(query).sort({ order: 1, createdAt: 1 })

    if (classGroup) {
      lessons = lessons.filter(lesson => lesson.classGroups?.some(pattern => esref.matches(pattern, classGroup)))
    }

    if (withUnits) {
      return Promise.all(lessons.map(lesson => this.getLessonWithUnits(lesson)))
    }

    return lessons
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

  static async updateUnit({ unitId, title, items }) {
    const unit = await this.getUnitById(unitId)
    if (!unit) {
      const error = new Error('Unit not found')
      error.status = 404
      throw error
    }
    if (title) {
      unit.title = title
    }
    if (items) {
      unit.items = items
    }
    await unit.save()
    return unit
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
