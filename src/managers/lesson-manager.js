const Lesson = require('../models/lesson')
const Unit = require('../models/unit')

class LessonManager {
  getLessons() {
    return Lesson.lessons
  }

  createLesson({ title, description, classGroup, order }) {
    if (!title || !classGroup) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    const createdLesson = Lesson.create({ title, description, classGroup, order })

    return createdLesson
  }

  createUnit({ title, items = [] }) {
    if (!title) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    const unit = new Unit({ id, title, items })
    Unit.list.push(unit)
    return unit
  }

  createLessonMaterial({ title, type, content, passingScorePercent = null }) {
    if (!title || !type) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    const lessonMaterial = new LessonMaterial({ id, title, type, content, order: null, passingScorePercent })
    LessonMaterial.addLessonMaterial({ lessonMaterial })
    return lessonMaterial
  }

  getUnits() {
    return Unit.list
  }

  getLessonMaterials() {
    return LessonMaterial.lessonMaterials
  }

  assignUnitToLesson({ lessonId, unitId, order = null }) {
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

  getLessonById(lessonId) {
    return Lesson.lessons.find(lesson => lesson.id === lessonId) ?? null
  }

  getLessonsByGrade({ grade }) {
    return Lesson.getLessonsByGrade({ grade })
  }
}

module.exports = LessonManager
