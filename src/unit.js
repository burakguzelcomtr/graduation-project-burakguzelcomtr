class Unit {
  constructor({ id, title, items = [] }) {
    this.id = id
    this.title = title
    this.items = items
  }

  hasItem({ itemId }) {
    return this.items.some(item => item.id === itemId)
  }
}

module.exports = Unit
