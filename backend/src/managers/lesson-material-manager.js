const Unit = require('../models/unit')
const LessonMaterial = require('../models/lesson-material')
const LessonManager = require('./lesson-manager')

class LessonMaterialManager {
  static async getLessonMaterialById(lessonMaterialId) {
    const lessonMaterial = await LessonMaterial.findById(lessonMaterialId)
    if (!lessonMaterial) {
      const error = new Error('Lesson material not found')
      error.status = 404
      throw error
    }

    return lessonMaterial
  }

  static async createLessonMaterial({ title, type, content, passingScorePercent = null }) {
    if (!title || !type) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    if (!['topic', 'quiz'].includes(type)) {
      const error = new Error('Invalid lesson material type')
      error.status = 400
      throw error
    }

    return LessonMaterial.create({
      title,
      type,
      content,
      passingScorePercent,
    })
  }

  static async getLessonMaterials({ unitId } = {}) {
    const query = unitId ? { unit: unitId } : {}
    return LessonMaterial.find(query).sort({ order: 1, createdAt: 1 })
  }

  static async updateLessonMaterial({ lessonMaterialId, title, type, content, passingScorePercent, order }) {
    const lessonMaterial = await this.getLessonMaterialById(lessonMaterialId)

    if (type && !['topic', 'quiz'].includes(type)) {
      const error = new Error('Invalid lesson material type')
      error.status = 400
      throw error
    }

    if (title !== undefined) {
      lessonMaterial.title = title
    }

    if (type !== undefined) {
      lessonMaterial.type = type
    }

    if (content !== undefined) {
      lessonMaterial.content = content
    }

    if (passingScorePercent !== undefined) {
      lessonMaterial.passingScorePercent = passingScorePercent
    }

    if (order !== undefined) {
      lessonMaterial.order = order
    }

    lessonMaterial.updatedAt = new Date()

    if (lessonMaterial.unit) {
      const unit = await Unit.findById(lessonMaterial.unit)
      if (unit) {
        const item = unit.items.find(existingItem => String(existingItem.item) === String(lessonMaterial.id))
        if (item) {
          item.itemType = lessonMaterial.type
          if (order !== undefined) {
            item.order = order
          }
          await unit.save()
        }
      }
    }

    await lessonMaterial.save()
    return lessonMaterial
  }

  static async assignLessonMaterialToUnit({ lessonId, unitId, lessonMaterialId, order = null }) {
    await LessonManager.getLessonById(lessonId)

    const unit = await Unit.findOne({ _id: unitId, lesson: lessonId })
    if (!unit) {
      const error = new Error('Unit not found in lesson')
      error.status = 404
      throw error
    }

    const lessonMaterial = await this.getLessonMaterialById(lessonMaterialId)

    const alreadyAssigned = unit.items.some(item => String(item.item) === String(lessonMaterial.id))
    if (alreadyAssigned) {
      const error = new Error('Lesson material already assigned to this unit')
      error.status = 400
      throw error
    }

    const itemOrder = order ?? unit.items.length + 1

    lessonMaterial.unit = unit.id
    lessonMaterial.order = itemOrder
    lessonMaterial.updatedAt = new Date()
    unit.items.push({
      itemType: lessonMaterial.type,
      item: lessonMaterial.id,
      order: itemOrder,
    })

    await Promise.all([lessonMaterial.save(), unit.save()])

    return Unit.findById(unit.id)
  }

  static async deleteLessonMaterial(lessonMaterialId) {
    const lessonMaterial = await this.getLessonMaterialById(lessonMaterialId)

    if (lessonMaterial.unit) {
      await Unit.findByIdAndUpdate(lessonMaterial.unit, {
        $pull: {
          items: { item: lessonMaterial.id },
        },
      })
    }

    await LessonMaterial.findByIdAndDelete(lessonMaterial.id)

    return lessonMaterial
  }
}

module.exports = LessonMaterialManager
