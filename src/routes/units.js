const express = require('express')
const LessonManager = require('../lesson-manager')

const router = express.Router()
const lessonManager = new LessonManager()

/* GET unit listing. */
router.get('/', (req, res) => {
  try {
    res.send(lessonManager.getUnits())
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new unit. */
router.post('/', (req, res) => {
  try {
    const { title } = req.body
    const newUnit = lessonManager.createUnit({ title })
    res.send({
      id: newUnit.id,
      title: newUnit.title,
      items: newUnit.items,
    })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router
