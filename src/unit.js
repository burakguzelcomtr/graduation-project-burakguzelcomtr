class Unit {
  constructor(id, title) {
    this.id = id
    this.title = title
    this.items = [] // { itemId, itemType: 'topic' | 'quiz', content }
  }
}

export default Unit
