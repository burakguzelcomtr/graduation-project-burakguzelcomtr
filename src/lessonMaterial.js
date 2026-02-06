class LessonMaterial {
  constructor(id, title, type, content, order = null) {
    this.id = id
    this.title = title
    this.type = type // 'topic' | 'quiz'
    this.content = content
    this.order = order
  }
}

module.exports = LessonMaterial
