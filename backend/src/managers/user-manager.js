const User = require('../models/user')

class UserManager {
  static async getStudents() {
    const users = await User.find({ role: 'student' })
    return users
  }

  static async getTeachers() {
    const users = await User.find({ role: 'teacher' })
    return users
  }
}

module.exports = UserManager
