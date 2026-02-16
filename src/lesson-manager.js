const Lesson = require('./lesson')
const Unit = require('./unit')
const LessonMaterial = require('./lesson-material')

class LessonManager {
  createLesson({ id, title, grade }) {
    const lesson = new Lesson({ id, title, grade })
    Lesson.addLesson({ lesson })
    return lesson
  }

  createUnit({ id, title, items = [] }) {
    return new Unit({ id, title, items })
  }

  createLessonMaterial({ id, title, type, content, passingScorePercent = null }) {
    const lessonMaterial = new LessonMaterial({ id, title, type, content, order: null, passingScorePercent })
    LessonMaterial.addLessonMaterial({ lessonMaterial })
    return lessonMaterial
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

  getLessonsByGrade({ grade }) {
    return Lesson.getLessonsByGrade({ grade })
  }
}

module.exports = LessonManager
