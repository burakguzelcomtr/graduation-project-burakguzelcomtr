const ClassGroup = require('../models/class-group')

class ClassGroupManager {
  getClassGroups() {
    return ClassGroup.find().lean()
  }
 

  async getClassGroupById(id) {
    const classGroup = await ClassGroup.findById(id).lean()
    if (!classGroup) {
      const error = new Error('Class group not found')
      error.status = 404
      throw error
    }
    return classGroup
  }

  async createClassGroup({ grade, section }) {
    if (!grade || !section) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    return ClassGroup.create({ grade, section })
  }

  addStudentToClassGroup({ student, classGroup }) {
    if (classGroup.grade !== student.grade || classGroup.section !== student.section) {
      const error = new Error('No matching classroom found')
      error.status = 400
      throw error
    }

    classGroup.students.push(student)
  }

  assignTeacherToClassGroup({ teacher, classGroup }) {
    if (classGroup.grade !== teacher.grade || classGroup.section !== teacher.section) {
      const error = new Error('No matching classroom found')
      error.status = 400
      throw error
    }

    classGroup.setTeacher(teacher)
  }
}

module.exports = ClassGroupManager
