const Lesson = require('../models/lesson')
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

  static async getLessons() {
    return Lesson.find().sort({ order: 1, createdAt: 1 })
  }

  static async createLesson({ title, description, classGroups = [], order }) {
    if (!title) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    return Lesson.create({ title, description, classGroups, order })
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
