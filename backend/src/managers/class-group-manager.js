const ClassGroup = require('../models/class-group')

class ClassGroupManager {
  static async getClassGroups() {
    const classGroups = await ClassGroup.find()
    return classGroups
  }

  static async getClassGroupById(id) {
    const classGroup = await ClassGroup.findById(id)
    if (!classGroup) {
      const error = new Error('Class group not found')
      error.status = 404
      throw error
    }
    return classGroup
  }

  static async createClassGroup({ grade, section, campus }) {
    if (!grade || !section || !campus) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }
    return ClassGroup.create({ grade, section, campus })
  }
}

module.exports = ClassGroupManager
