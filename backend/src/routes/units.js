const express = require('express')
const LessonManager = require('../managers/lesson-manager')

const router = express.Router()

/* GET unit listing. */
router.get('/', async (req, res) => {
  try {
    const { lessonId } = req.query
    const units = lessonId ? await LessonManager.getUnitsByLesson({ lessonId }) : await LessonManager.getUnits()
    return res.send(units)
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

/* POST create a new unit. */
router.post('/', async (req, res) => {
  try {
    const { title, lesson, slug } = req.body
    const newUnit = await LessonManager.createUnit({ title, lesson, slug })
    return res.send({
      id: newUnit.id,
      title: newUnit.title,
      slug: newUnit.slug,
      lesson: newUnit.lesson,
      items: newUnit.items,
    })
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

/* PUT update a unit. Slug is only updated when explicitly provided. */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, items, slug } = req.body
    const updatedUnit = await LessonManager.updateUnit({ unitId: id, title, items, slug })
    return res.send(updatedUnit)
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

module.exports = router
