class LessonProgress {
  constructor({ id, lessonId, studentId }) {
    this.id = id
    this.lessonId = lessonId
    this.studentId = studentId
    this.units = [] // { unitId, startedAt, completedAt, items: [{ itemId, itemType, startedAt, completedAt, score? }] }
    this.startedAt = null
    this.completedAt = null
  }

  startLesson() {
    if (!this.startedAt) {
      this.startedAt = new Date()
    }
  }

  completeLesson() {
    this.completedAt = new Date()
  }

  getOrCreateUnit(unitId) {
    let unit = this.units.find(u => u.unitId === unitId)
    if (!unit) {
      unit = { unitId, startedAt: null, completedAt: null, items: [] }
      this.units.push(unit)
    }
    return unit
  }

  startUnit(unitId) {
    if (!this.startedAt) {
      this.startLesson()
    }
    const unit = this.getOrCreateUnit(unitId)
    if (!unit.startedAt) {
      unit.startedAt = new Date()
    }
    return unit
  }

  completeUnit(unitId) {
    if (!this.startedAt) {
      throw new Error('Lesson has not been started yet')
    }
    const unit = this.getOrCreateUnit(unitId)
    if (!unit.completedAt) {
      unit.completedAt = new Date()
    }
    return unit
  }

  getOrCreateItem(unitId, itemId, itemType) {
    const unit = this.getOrCreateUnit(unitId)
    let item = unit.items.find(i => i.itemId === itemId)
    if (!item) {
      item = { itemId, itemType, startedAt: null, completedAt: null, score: null }
      unit.items.push(item)
    }
    return item
  }

  startItem(unitId, itemId, itemType) {
    this.startUnit(unitId)
    const item = this.getOrCreateItem(unitId, itemId, itemType)
    if (!item.startedAt) {
      item.startedAt = new Date()
    }
    return item
  }

  completeItem(unitId, itemId, score = null) {
    const item = this.getOrCreateItem(unitId, itemId)
    item.completedAt = new Date()
    if (score !== null) {
      item.score = score
    }
    return item
  }
}

module.exports = LessonProgress
