const express = require('express')
const { celebrate, Joi, Segments } = require('celebrate')
const authorize = require('../middleware/authorize')
const LessonManager = require('../managers/lesson-manager')

const objectId = Joi.string().hex().length(24)

const router = express.Router()

/* GET unit listing. */
router.get(
  '/',
  authorize('units', 'read'),
  celebrate({ [Segments.QUERY]: Joi.object({ lessonId: objectId }) }),
  async (req, res) => {
  try {
    const { lessonId } = req.query
    const units = lessonId ? await LessonManager.getUnitsByLesson({ lessonId }) : await LessonManager.getUnits()
    return res.send(units)
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

/* POST create a new unit. */
router.post(
  '/',
  authorize('units', 'create'),
  celebrate({
    [Segments.BODY]: Joi.object({
      title: Joi.string().required(),
      lesson: objectId,
      slug: Joi.string(),
    }),
  }),
  async (req, res) => {
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
router.put(
  '/:id',
  authorize('units', 'update'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: objectId.required() }),
    [Segments.BODY]: Joi.object({ title: Joi.string(), items: Joi.array(), slug: Joi.string() }),
  }),
  async (req, res) => {
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
