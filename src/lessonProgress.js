class LessonProgress {
  constructor({ id, lessonId, studentId }) {
    this.id = id
    this.lessonId = lessonId
    this.studentId = studentId
    this.units = [] // { unitId, startedAt, completedAt, items: [{ id, type, startedAt, completedAt, score? }] }
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

  getUnit(unitId) {
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
    const unit = this.getUnit(unitId)
    if (!unit.startedAt) {
      unit.startedAt = new Date()
    }
    return unit
  }

  completeUnit(unitId) {
    if (!this.startedAt) {
      throw new Error('Lesson has not been started yet')
    }
    const unit = this.getUnit(unitId)
    if (!unit.completedAt) {
      unit.completedAt = new Date()
    }
    return unit
  }

  getItem(unitId, itemId, itemType) {
    const unit = this.getUnit(unitId)
    let item = unit.items.find(i => i.id === itemId)
    if (!item) {
      item = { id: itemId, type: itemType, startedAt: null, completedAt: null, score: null }
      unit.items.push(item)
    } else if (!item.type && itemType) {
      item.type = itemType
    }
    return item
  }

  startItem(unitId, itemId, itemType) {
    this.startUnit(unitId)
    const item = this.getItem(unitId, itemId, itemType)
    if (!item.startedAt) {
      item.startedAt = new Date()
    }
    return item
  }

  completeItem(unitId, itemId, score = null) {
    const unit = this.units.find(u => u.unitId === unitId)
    if (!unit) {
      throw new Error('Unit has not been started yet')
    }
    const item = unit.items.find(i => i.id === itemId)
    if (!item) {
      throw new Error('Item has not been started yet')
    }
    item.completedAt = new Date()
    if (score !== null) {
      item.score = score
    }
    return item
  }
}

module.exports = LessonProgress
