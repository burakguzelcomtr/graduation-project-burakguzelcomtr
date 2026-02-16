const LessonProgress = require('./lesson-progress')
const generateId = require('./id-generator')

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

  getProgressByLessonAndStudent({ lessonId, studentId }) {
    return this.lessonProgresses.find(progress => progress.lessonId === lessonId && progress.studentId === studentId)
  }

  getLessonProgress({ lesson, student }) {
    if (!lesson.canBeAccessedBy({ student })) {
      throw new Error('Student cannot access this lesson.')
    }
    let progress = this.getProgressByLessonAndStudent({ lessonId: lesson.id, studentId: student.id })
    if (!progress) {
      progress = this.createLessonProgress({ lessonId: lesson.id, studentId: student.id })
    }
    return progress
  }

  startUnit({ lesson, student, unitId }) {
    if (!lesson.canBeAccessedBy({ student })) {
      throw new Error('Student cannot access this lesson.')
    }
    if (!lesson.hasUnit({ unitId })) {
      throw new Error('Unit not found in lesson.')
    }
    const progress = this.getLessonProgress({ lesson, student })
    progress.startUnit({ unitId })
    return progress
  }

  startItem({ lesson, student, unitId, itemId, itemType }) {
    if (!lesson.canBeAccessedBy({ student })) {
      throw new Error('Student cannot access this lesson.')
    }
    if (!lesson.hasUnit({ unitId })) {
      throw new Error('Unit not found in lesson.')
    }
    if (!lesson.hasItem({ unitId, itemId })) {
      throw new Error('Item not found in unit.')
    }
    const progress = this.getLessonProgress({ lesson, student })
    progress.startItem({ unitId, itemId, itemType })
    return progress
  }

  completeItem({ lesson, student, unitId, itemId, score = null }) {
    if (!lesson.canBeAccessedBy({ student })) {
      throw new Error('Student cannot access this lesson.')
    }
    if (!lesson.hasUnit({ unitId })) {
      throw new Error('Unit not found in lesson.')
    }
    if (!lesson.hasItem({ unitId, itemId })) {
      throw new Error('Item not found in unit.')
    }
    const progress = this.getLessonProgress({ lesson, student })
    progress.completeItem({ unitId, itemId, score })

    if (lesson.isUnitComplete({ unitId, progress })) {
      progress.completeUnit({ unitId })
    }

    if (lesson.isLessonComplete({ progress })) {
      progress.completeLesson()
    }

    return progress
  }
}

module.exports = LessonProgressManager
