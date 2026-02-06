const LessonProgress = require('./lessonProgress')
const generateId = require('./idGenerator')

class LessonProgressManager {
  constructor() {
    this.lessonProgresses = []
  }

  createLessonProgress({ lessonId, studentId }) {
    const progress = new LessonProgress({
      id: generateId(),
      lessonId,
      studentId,
    })
    this.lessonProgresses.push(progress)
    return progress
  }

  getProgressByLessonAndStudent(lessonId, studentId) {
    return this.lessonProgresses.find(progress => progress.lessonId === lessonId && progress.studentId === studentId)
  }

  getLessonProgress({ lesson, student }) {
    this.checkLessonAccess(student, lesson)
    const studentId = student.id
    let progress = this.getProgressByLessonAndStudent(lesson.id, studentId)
    if (!progress) {
      progress = this.createLessonProgress({ lessonId: lesson.id, studentId })
    }
    return progress
  }

  startUnit({ lesson, student, unitId }) {
    this.checkLessonAccess(student, lesson)
    this.checkUnitExists(lesson, unitId)
    const progress = this.getLessonProgress({ lesson, student })
    progress.startUnit(unitId)
    return progress
  }

  startItem({ lesson, student, unitId, itemId, itemType }) {
    this.checkLessonAccess(student, lesson)
    this.checkUnitExists(lesson, unitId)
    this.checkItemExists(lesson, unitId, itemId)
    const progress = this.getLessonProgress({ lesson, student })
    progress.startItem(unitId, itemId, itemType)
    return progress
  }

  completeItem({ lesson, student, unitId, itemId, score = null }) {
    this.checkLessonAccess(student, lesson)
    this.checkUnitExists(lesson, unitId)
    this.checkItemExists(lesson, unitId, itemId)
    const progress = this.getLessonProgress({ lesson, student })
    progress.completeItem(unitId, itemId, score)

    if (this.isUnitComplete(lesson, unitId, progress)) {
      progress.completeUnit(unitId)
    }

    if (this.isLessonComplete(lesson, progress)) {
      progress.completeLesson()
    }

    return progress
  }

  isUnitComplete(lesson, unitId, progress) {
    const unit = lesson.units.find(u => u.id === unitId)
    if (!unit || unit.items.length === 0) {
      return false
    }
    const unitProgress = progress.units.find(u => u.unitId === unitId)
    if (!unitProgress) {
      return false
    }
    return unit.items.every(item => unitProgress.items.some(p => p.id === item.id && p.completedAt))
  }

  isLessonComplete(lesson, progress) {
    if (!lesson.units || lesson.units.length === 0) {
      return false
    }
    return lesson.units.every(unit => progress.units.some(u => u.unitId === unit.id && u.completedAt))
  }

  checkLessonAccess(student, lesson) {
    if (student.grade !== lesson.grade) {
      throw new Error('Student cannot access this lesson.')
    }
  }

  checkUnitExists(lesson, unitId) {
    const exists = lesson.units.some(unit => unit.id === unitId)
    if (!exists) {
      throw new Error('Unit not found in lesson.')
    }
  }

  checkItemExists(lesson, unitId, itemId) {
    const unit = lesson.units.find(u => u.id === unitId)
    if (!unit) {
      throw new Error('Unit not found in lesson.')
    }
    const exists = unit.items.some(item => item.id === itemId)
    if (!exists) {
      throw new Error('Item not found in unit.')
    }
  }
}

module.exports = LessonProgressManager
