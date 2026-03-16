const express = require('express')

const router = express.Router()

const LessonManager = require('../managers/lesson-manager') 

/* GET lesson listing. */
router.get('/', async (req, res) => {
  try {
    const lessons = await LessonManager.getLessons()
    res.send(lessons)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new lesson. */
router.post('/', async (req, res) => {
  try {
    const { title, description, classGroups, order } = req.body
    const createdLesson = await LessonManager.createLesson({ title, description, classGroups, order })
    res.send(createdLesson)
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message })
  }
})

/* GET lesson by id. */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const lesson = await LessonManager.getLessonById(id)
    res.send(lesson)
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message })
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

router.post('/:lessonId/units/:unitId/lesson-materials', (req, res) => {
  try {
    const { lessonId, unitId } = req.params
    const { lessonMaterialId } = req.body
    const lesson = lessonManager.assignLessonMaterialToUnit({ lessonId, unitId, lessonMaterialId })
    res.send(lesson)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})
module.exports = router
