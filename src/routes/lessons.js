const express = require('express')

const router = express.Router()

const generateId = require('../id-generator')
const LessonManager = require('../lesson-manager')

const lessonManager = new LessonManager()

/* GET lesson listing. */
router.get('/', (req, res) => {
  try {
    res.send(lessonManager.getLessons())
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new lesson. */
router.post('/', (req, res) => {
  try {
    const { title, grade } = req.body
    const createdLesson = lessonManager.createLesson({ id: generateId(), title, grade })
    res.send(createdLesson)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* GET lesson by id. */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const lesson = lessonManager.getLessonById(id)
    res.send(lesson)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST assign a unit to a lesson. */
router.post('/:lessonId/units', (req, res) => {
  try {
    const { lessonId } = req.params
    const { unitId } = req.body
    const lesson = lessonManager.assignUnitToLesson({ lessonId, unitId })
    res.send(lesson)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router
