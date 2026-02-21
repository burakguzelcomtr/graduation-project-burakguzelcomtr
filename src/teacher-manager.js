const Teacher = require('./teacher')

class TeacherManager {
  getTeachers() {
    return Teacher.list
  }

  createTeacher({ name, surname, grade, section }) {
    if (!name || !surname || !grade || !section) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    return Teacher.createTeacher({ name, surname, grade, section })
  }
}

module.exports = TeacherManager
