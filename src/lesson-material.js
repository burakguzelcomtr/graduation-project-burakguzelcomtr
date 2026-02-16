class LessonMaterial {
  static lessonMaterials = []

  constructor({ id, title, type, content, order = null, passingScorePercent = null }) {
    this.id = id
    this.title = title
    this.type = type // 'topic' | 'quiz'
    this.content = content
    this.order = order
    this.passingScorePercent = passingScorePercent
  }

  static addLessonMaterial({ lessonMaterial }) {
    LessonMaterial.lessonMaterials.push(lessonMaterial)
  }

  static getLessonMaterialById({ lessonMaterialId }) {
    return LessonMaterial.lessonMaterials.find(lessonMaterial => lessonMaterial.id === lessonMaterialId) ?? null
  }
}

module.exports = LessonMaterial
