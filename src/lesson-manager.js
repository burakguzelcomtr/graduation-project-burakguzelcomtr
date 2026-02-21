const Lesson = require('./lesson')
const Unit = require('./unit')
const LessonMaterial = require('./lesson-material')
const generateId = require('./id-generator')

class LessonManager {
  getLessons() {
    return Lesson.lessons
  }

  createLesson({ id, title, grade }) {
    if (!title || !grade) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    const lesson = new Lesson({ id, title, grade })
    Lesson.addLesson({ lesson })
    return lesson
  }

  createUnit({ id, title, items = [] }) {
    if (!title) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    const unit = new Unit({ id, title, items })
    Unit.list.push(unit)
    return unit
  }

  createLessonMaterial({ id = generateId(), title, type, content, passingScorePercent = null }) {
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

  addUnitToLesson({ lesson, unit, order = null }) {
    const unitReference = unit
    unitReference.order = order ?? lesson.units.length + 1
    lesson.units.push(unitReference)
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

  assignUnitToLesson({ lessonId, unitId }) {
    const lesson = this.getLessonById(lessonId)
    if (!lesson) {
      const error = new Error('Lesson not found')
      error.status = 404
      throw error
    }

    const unit = Unit.list.find(existingUnit => existingUnit.id === unitId)
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

    lesson.units.push(unit)
    return lesson
  }
  
  getLessonById ( lessonId ) {
    return Lesson.lessons.find(lesson => lesson.id === lessonId) ?? null
  }

  getLessonsByGrade({ grade }) {
    return Lesson.getLessonsByGrade({ grade })
  }
}

module.exports = LessonManager
