const Lesson = require('./lesson')
const Unit = require('./unit')
const LessonMaterial = require('./lessonMaterial')

class LessonManager {
  constructor() {
    this.lessons = []
  }

  createLesson(id, title, grade) {
    const lesson = new Lesson(id, title, grade)
    this.lessons.push(lesson)
    return lesson
  }

  createUnit(id, title, items = []) {
    return new Unit(id, title, items)
  }

  createLessonMaterial(id, title, type, content) {
    return new LessonMaterial(id, title, type, content)
  }

  addUnitToLesson(lesson, unit, order = null) {
    unit.order = order ?? lesson.units.length + 1
    lesson.units.push(unit)
  }

  addLessonMaterialToUnit(unit, id, lessonMaterial, order = null) {
    unit.items.push({
      id,
      title: lessonMaterial.title,
      content: lessonMaterial.content,
      type: lessonMaterial.type,
      order: order ?? unit.items.length + 1,
    })
  }

  getLessonsByGrade(grade) {
    return this.lessons.filter(lesson => lesson.grade === grade)
  }
}

module.exports = LessonManager
