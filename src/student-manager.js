const generateId = require('./id-generator')
const Student = require('./student')

class StudentManager {
  getStudents() {
    return Student.list
  }

  createStudent({ name, surname, grade, section }) {
    if (!name || !surname || !grade || !section) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    return Student.createStudent({ id: generateId(), name, surname, grade, section })
  }
}

module.exports = StudentManager
