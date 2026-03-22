const ClassGroup = require('../models/class-group')

class ClassGroupManager {
  static async getClassGroups() {
    const classGroups = await ClassGroup.find()
    return classGroups
  }

  static async getClassGroupById(id) {
    const classGroup = await ClassGroup.findById(id)
    if (!classGroup) {
      throw new Error('Class group not found')
    }
    return classGroup
  }

  static async createClassGroup({ grade, section, campus }) {
    if (!grade || !section || !campus) {
      throw new Error('Missing required fields')
    }
    return ClassGroup.create({ grade, section, campus })
  }

  static async addStudentToClassGroup({ student, classGroup }) {
    if (classGroup.grade !== student.grade || classGroup.section !== student.section) {
      throw new Error('No matching classroom found')
    }

    classGroup.students.push(student)
  }

  static async assignTeacherToClassGroup({ teacher, classGroup }) {
    if (classGroup.grade !== teacher.grade || classGroup.section !== teacher.section) {
      throw new Error('No matching classroom found')
    }

    return ClassGroup.findByIdAndUpdate(classGroup.id, { teacher: teacher.id ?? teacher }, { new: true })
  }
}

module.exports = ClassGroupManager
