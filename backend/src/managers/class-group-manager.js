const ClassGroup = require('../models/class-group')

class ClassGroupManager {
  static async getClassGroups() {
    const classGroups = await ClassGroup.find()
    return classGroups
  }

  static async getClassGroupById(id) {
    const classGroup = await ClassGroup.findById(id)
    return classGroup
  }

  static async createClassGroup({ grade, section, campus }) {
    return ClassGroup.create({ grade, section, campus })
  }
}

module.exports = ClassGroupManager
