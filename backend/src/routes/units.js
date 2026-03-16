const express = require('express')
const LessonManager = require('../managers/lesson-manager')

const router = express.Router() 

/* GET unit listing. */
router.get('/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params
    const getUnits = await LessonManager.getUnitsByGrade({ lessonId } || {} )
    res.send(getUnits)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new unit. */
router.post('/', async (req, res) => {
  try {
    const { title } = req.body
    const newUnit = await LessonManager.createUnit({ title })
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
