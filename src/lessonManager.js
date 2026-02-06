const Lesson = require('./lesson')

const Topic = require('./lessonMaterial')

class LessonManager {
  constructor() {
    this.lessons = []
  }

  createLesson(id, title, grade) {
    const lesson = new Lesson(id, title, grade)
    this.lessons.push(lesson)
    return lesson
  }

  createUnit(id, title) {
    return { id, title, items: [] }
  }

  createTopic(id, title, content) {
    return new Topic(id, title, 'topic', content)
  }

  createQuiz(id, title, questions = []) {
    return new Topic(id, title, 'quiz', questions)
  }

  addUnit(lesson, unit, order = null) {
    lesson.units.push({
      id: unit.id,
      order: order ?? lesson.units.length + 1,
      title: unit.title,
      items: unit.items ? unit.items : [],
    })
  }

  addLessonMaterial(unit, id, lessonMaterial, type, order = null) {
    unit.items.push({
      id,
      title: lessonMaterial.title,
      content: lessonMaterial.content,
      type,
      order: order ?? unit.items.length + 1,
    })
  }

  getLessonsByGrade(grade) {
    return this.lessons.filter(lesson => lesson.getLessonByGrade(grade))
  }
}

module.exports = LessonManager
