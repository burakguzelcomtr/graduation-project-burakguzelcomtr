const ClassGroup = require('./class-group')

class ClassGroupManager {
  getClassGroups() {
    return ClassGroup.list
  }

  getClassGroupById(id) {
    const classGroup = ClassGroup.list.find(classGroupItem => classGroupItem.id === id)
    if (!classGroup) {
      const error = new Error('Class group not found')
      error.status = 404
      throw error
    }
    return classGroup
  }

  createClassGroup({ grade, section }) {
    if (!grade || !section) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    return ClassGroup.createClassGroup({ grade, section })
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
