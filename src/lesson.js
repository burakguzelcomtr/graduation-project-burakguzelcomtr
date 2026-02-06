class Lesson {
  constructor(id, title, grade, units = []) {
    this.id = id
    this.title = title
    this.grade = grade
    this.units = units
  }

  getLessonByGrade(grade) {
    if (this.grade === grade) {
      return this
    }
    return null
  }
}

module.exports = Lesson
