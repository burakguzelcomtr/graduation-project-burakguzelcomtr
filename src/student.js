const generateId = require('./id-generator')

class Student {
  constructor({ name, surname, grade, section, id = null }) {
    this.id = id || generateId()
    this.name = name
    this.surname = surname
    this.grade = grade
    this.section = section
  }
}

module.exports = Student
