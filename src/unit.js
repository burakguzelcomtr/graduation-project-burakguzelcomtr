class Unit {
  constructor(id, title, items = []) {
    this.id = id
    this.title = title
    this.items = items // { id, type: 'topic' | 'quiz', content }
  }
}

module.exports = Unit
