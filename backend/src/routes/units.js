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
    const { title } = req.body
    const newUnit = await LessonManager.createUnit({ title })
    return res.send({
      id: newUnit.id,
      title: newUnit.title,
      items: newUnit.items,
    })
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

module.exports = router
