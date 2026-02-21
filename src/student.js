const generateId = require('./id-generator')

class Student {
  constructor({ name, surname, grade, section, id = null }) {
    this.id = id || generateId()
    this.name = name
    this.surname = surname
    this.grade = grade
    this.section = section
  }

  static list = []

  static createStudent({ name, surname, grade, section }) {
    const newStudent = new Student({ name, surname, grade, section })
    Student.list.push(newStudent)
    return newStudent
  }
}

module.exports = Student
