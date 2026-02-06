class Lesson {
  constructor(id, title, grade, units = []) {
    this.id = id
    this.title = title
    this.grade = grade
    this.units = units
  }
}

module.exports = Lesson
