const express = require('express')

const router = express.Router()

const LessonManager = require('../managers/lesson-manager')

const lessonManager = new LessonManager()

/* GET lesson material listing. */
router.get('/', (req, res) => {
  try {
    res.send(lessonManager.getLessonMaterials())
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new lesson material. */
router.post('/', (req, res) => {
  try {
    const { title, type, content, passingScorePercent } = req.body
    const lessonMaterial = lessonManager.createLessonMaterial({
      title,
      type,
      content,
      passingScorePercent,
    })

    res.send(lessonMaterial)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router
