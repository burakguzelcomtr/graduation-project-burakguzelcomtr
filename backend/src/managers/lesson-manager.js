const Lesson = require('../models/lesson')
const Unit = require('../models/unit')

class LessonManager {
  static async getLessons() {
    const lessons = await Lesson.find()
    return lessons
  }

  static async createLesson({ title, description, classGroups, order }) {
    if (!title || !classGroups || classGroups.length === 0) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    const createdLesson = await Lesson.create({ title, description, classGroups, order })
    console.log('Created lesson:', createdLesson)
    return createdLesson
  }

  static async getLessonById(lessonId) {
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
      throw new Error('Lesson not found')
    }
    return lesson
  }

  static async getLessonsByGrade({ grade }) {
    const lessons = await Lesson.find({ 'classGroups.grade': grade })
    return lessons
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

  static async getUnitsByGrade({ grade }) {
    const units = await Unit.find({ 'lessons.classGroups.grade': grade })
    return units
  }

  static async createLessonMaterial({ title, type, content, passingScorePercent = null }) {
    if (!title || !type) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    const lessonMaterial = new LessonMaterial({ id, title, type, content, order: null, passingScorePercent })
    LessonMaterial.addLessonMaterial({ lessonMaterial })
    return lessonMaterial
  } 

  static async getLessonMaterials() {
    return LessonMaterial.lessonMaterials
  }

  static async assignUnitToLesson({ lessonId, unitId, order = null }) {
    const lesson = this.getLessonById(lessonId)
    if (!lesson) {
      const error = new Error('Lesson not found')
      error.status = 404
      throw error
    }
    unit = Unit.list.find(existingUnit => existingUnit.id === unitId)
    if (!unit) {
      const error = new Error('Unit not found')
      error.status = 404
      throw error
    }
    if (lesson.hasUnit({ unitId })) {
      const error = new Error('Unit already assigned to this lesson')
      error.status = 400
      throw error
    }
    units = lesson.units
    units.push({
      id: unitId,
      order: order ?? units.length + 1,
    })
    return lesson
  }

  addLessonMaterialToUnit({ unit, id, lessonMaterialId, order = null }) {
    const lessonMaterial = LessonMaterial.getLessonMaterialById({ lessonMaterialId })
    if (!lessonMaterial) {
      throw new Error('Lesson material not found.')
    }

    unit.items.push({
      id,
      lessonMaterialId,
      order: order ?? unit.items.length + 1,
    })
  }
}

module.exports = LessonManager
