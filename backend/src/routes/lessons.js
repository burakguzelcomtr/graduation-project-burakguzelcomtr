const express = require('express')

const router = express.Router()

const LessonManager = require('../managers/lesson-manager')
const LessonMaterialManager = require('../managers/lesson-material-manager')

/* GET lesson listing.
   ?classGroupId=X  → only lessons assigned to that class group
   ?type=main       → only lessons matching the given type
   ?withUnits=true  → include units per lesson
*/
router.get('/', async (req, res) => {
  try {
    const { classGroupId, withUnits, type = 'main' } = req.query
    let lessons = []

    lessons = await LessonManager.getLessons({ classGroupId, type, withUnits })

    return res.send(lessons)
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

/* POST create a new lesson. */
router.post('/', async (req, res) => {
  try {
    const { title, description, classGroups, type, order } = req.body
    const createdLesson = await LessonManager.createLesson({ title, description, classGroups, type, order })
    return res.send(createdLesson)
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

/* GET lesson by id. ?withUnits=true includes units. */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { withUnits } = req.query
    const lesson = await LessonManager.getLessonById({ id, withUnits })
    return res.send(lesson)
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

/* POST assign a unit to a lesson. */
router.post('/:lessonId/units', async (req, res) => {
  try {
    const { lessonId } = req.params
    const { unitId, order } = req.body
    const lesson = await LessonManager.assignUnitToLesson({ lessonId, unitId, order })
    res.send(lesson)
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message })
  }
})

router.post('/:lessonId/units/:unitId/lesson-materials', async (req, res) => {
  try {
    // TODO : express params
    const { lessonId, unitId } = req.params
    const { lessonMaterialId, order } = req.body
    const unit = await LessonMaterialManager.assignLessonMaterialToUnit({
      lessonId,
      unitId,
      lessonMaterialId,
      order,
    })
    res.send(unit)
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message })
  }
})

module.exports = router
