const mongoose = require('mongoose')
const User = require('../models/user')
const Account = require('../models/account')

class UserManager {
  static async getStudents(query = {}) {
    return User.Student.find(query)
  }

  static async getStudentsByClassGroup(classGroupId) {
    return User.Student.find({ classGroup: classGroupId })
  }

  static async getStudentById(id) {
    const student = await User.Student.findById(id)
    if (!student) {
      const error = new Error('Student not found')
      error.status = 404
      throw error
    }
    return student
  }

  static async updateStudentProfile(id, update) {
    const student = await User.Student.findByIdAndUpdate(id, update, { new: true, runValidators: true })
    if (!student) {
      const error = new Error('Student not found')
      error.status = 404
      throw error
    }
    return student
  }

  static async createStudent({ name, surname, studentId, grade, section, campus, classGroup, email, password }) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const [newStudent] = await User.Student.create(
        [{ name, surname, studentId, grade, campus, section, classGroup }],
        { session }
      )
      // eslint-disable-next-line no-underscore-dangle
      const account = new Account({ email, user: newStudent._id })
      await account.setPassword(password)
      await account.save({ session })
      await session.commitTransaction()
      return newStudent
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  static async getTeachers() {
    const users = await User.Teacher.find()
    return users
  }
}

module.exports = UserManager
