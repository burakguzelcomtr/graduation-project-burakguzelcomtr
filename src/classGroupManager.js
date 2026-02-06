const ClassGroup = require('./classGroup')

class ClassGroupManager {
  createClassGroup(grade, section) {
    return new ClassGroup(grade, section)
  }

  addStudentToClassGroup(student, classGroup) {
    if (classGroup.grade !== student.grade || classGroup.section !== student.section) {
      throw new Error('No matching classroom found')
    }
    classGroup.students.push(student)
  }

  assignTeacherToClassGroup(teacher, classGroup) {
    if (classGroup.grade !== teacher.grade || classGroup.section !== teacher.section) {
      throw new Error('No matching classroom found')
    }
    classGroup.setTeacher(teacher)
  }
}

module.exports = ClassGroupManager
