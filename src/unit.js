const generateId = require('./id-generator')

class Unit {
  static list = []

  constructor({ id, title, items = [] }) {
    this.id = id || generateId()
    this.title = title
    this.items = items
  }

  static createUnit({ title }) {
    if (!title) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    const newUnit = new Unit({ title })
    Unit.list.push(newUnit)
    return newUnit
  }

  hasItem({ itemId }) {
    return this.items.some(item => item.id === itemId)
  }
}

module.exports = Unit
