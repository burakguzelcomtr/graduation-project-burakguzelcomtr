const generateId = require('./id-generator')

class Teacher {
  static list = []

  constructor({ name, surname, grade, section, id = null }) {
    this.id = id || generateId()
    this.name = name
    this.surname = surname
    this.grade = grade
    this.section = section
  }

  static createTeacher({ name, surname, grade, section }) {
    const newTeacher = new Teacher({ name, surname, grade, section })
    Teacher.list.push(newTeacher)
    return newTeacher
  }
}

module.exports = Teacher
