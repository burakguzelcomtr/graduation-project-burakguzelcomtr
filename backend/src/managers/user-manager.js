const User = require('../models/user')

class UserManager {
  static async getStudents() {
    const users = await User.Student.find()
    return users
  }

  static async getTeachers() {
    const users = await User.Teacher.find()
    return users
  }
}

module.exports = UserManager
