class Lesson {
  static lessons = []

  constructor({ id, title, grade, units = [] }) {
    this.id = id
    this.title = title
    this.grade = grade
    this.units = units
  }

  static addLesson({ lesson }) {
    Lesson.lessons.push(lesson)
  }

  static getLessonsByGrade({ grade }) {
    return Lesson.lessons.filter(lesson => lesson.grade === grade)
  }

  canBeAccessedBy({ student }) {
    return student.grade === this.grade
  }

  getUnit({ unitId }) {
    return this.units.find(unit => unit.id === unitId) ?? null
  }

  hasUnit({ unitId }) {
    return Boolean(this.getUnit({ unitId }))
  }

  hasItem({ unitId, itemId }) {
    const unit = this.getUnit({ unitId })
    if (!unit) {
      return false
    }
    return unit.hasItem({ itemId })
  }

  isUnitComplete({ unitId, progress }) {
    const unit = this.getUnit({ unitId })
    if (!unit || unit.items.length === 0) {
      return false
    }

    const unitProgress = progress.units.find(u => u.unitId === unitId)
    if (!unitProgress) {
      return false
    }

    const completedItemsCount = unit.items.filter(item =>
      unitProgress.items.some(p => p.id === item.id && p.completedAt)
    ).length

    return completedItemsCount === unit.items.length
  }

  isLessonComplete({ progress }) {
    if (!this.units || this.units.length === 0) {
      return false
    }
    const completedUnitsCount = this.units.filter(unit =>
      progress.units.some(u => u.unitId === unit.id && u.completedAt)
    ).length

    return completedUnitsCount === this.units.length
  }
}

module.exports = Lesson
