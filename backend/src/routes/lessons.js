const express = require('express')

const router = express.Router()

const { celebrate, Joi, Segments } = require('celebrate')
const LessonManager = require('../managers/lesson-manager')
const LessonMaterialManager = require('../managers/lesson-material-manager')
const authorize = require('../middleware/authorize')

const objectId = Joi.string().hex().length(24)

/* GET lesson listing.
   ?classGroup=3-A-X → only lessons whose class-group pattern matches the given key
   ?type=main       → only lessons matching the given type
   ?withUnits=true  → include units per lesson
*/
router.get(
  '/',
  authorize('lessons', 'read'),
  celebrate({
    [Segments.QUERY]: Joi.object({
      classGroup: Joi.string(),
      withUnits: Joi.string(),
      type: Joi.string(),
    }),
  }),
  async (req, res) => {
    try {
      const { classGroup, withUnits, type = 'main' } = req.query
      let lessons = []

      lessons = await LessonManager.getLessons({ classGroup, type, withUnits })

      return res.send(lessons)
    } catch (error) {
      return res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* POST create a new lesson. */
router.post(
  '/',
  authorize('lessons', 'create'),
  celebrate({
    [Segments.BODY]: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().allow(''),
      classGroups: Joi.array().items(Joi.string()),
      type: Joi.string(),
      order: Joi.number().integer(),
      slug: Joi.string(),
    }),
  }),
  async (req, res) => {
    try {
      const { title, description, classGroups, type, order, slug } = req.body
      const createdLesson = await LessonManager.createLesson({ title, description, classGroups, type, order, slug })
      return res.send(createdLesson)
    } catch (error) {
      return res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* PUT update a lesson. Slug is only updated when explicitly provided. */
router.put(
  '/:id',
  authorize('lessons', 'update'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: objectId.required() }),
    [Segments.BODY]: Joi.object({
      title: Joi.string(),
      description: Joi.string().allow(''),
      classGroups: Joi.array().items(Joi.string()),
      type: Joi.string(),
      order: Joi.number().integer(),
      slug: Joi.string(),
    }),
  }),
  async (req, res) => {
    try {
      const { id } = req.params
      const { title, description, classGroups, type, order, slug } = req.body
      const updatedLesson = await LessonManager.updateLesson({
        lessonId: id,
        title,
        description,
        classGroups,
        type,
        order,
        slug,
      })
      return res.send(updatedLesson)
    } catch (error) {
      return res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* GET lesson by slug. ?withUnits=true includes units. */
router.get(
  '/slug/:slug',
  authorize('lessons', 'read'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ slug: Joi.string().required() }),
    [Segments.QUERY]: Joi.object({ withUnits: Joi.string() }),
  }),
  async (req, res) => {
    try {
      const { slug } = req.params
      const withUnits = req.query.withUnits === 'true'
      const lesson = await LessonManager.getLessonBySlug(slug, withUnits)
      return res.send(lesson)
    } catch (error) {
      return res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* GET unit by lesson slug and unit slug. */
router.get(
  '/slug/:lessonSlug/units/:unitSlug',
  authorize('lessons', 'read'),
  celebrate({
    [Segments.PARAMS]: Joi.object({
      lessonSlug: Joi.string().required(),
      unitSlug: Joi.string().required(),
    }),
  }),
  async (req, res) => {
    try {
      const { lessonSlug, unitSlug } = req.params
      const unit = await LessonManager.getUnitBySlug(lessonSlug, unitSlug)
      return res.send(unit)
    } catch (error) {
      return res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* GET lesson by id. ?withUnits=true includes units. */
router.get(
  '/:id',
  authorize('lessons', 'read'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: objectId.required() }),
    [Segments.QUERY]: Joi.object({ withUnits: Joi.string() }),
  }),
  async (req, res) => {
    try {
      const { id } = req.params
      const withUnits = req.query.withUnits === 'true'
      const lesson = await LessonManager.getLessonById(id, withUnits)
      return res.send(lesson)
    } catch (error) {
      return res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* POST assign a unit to a lesson. */
router.post(
  '/:lessonId/units',
  authorize('lessons', 'update'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ lessonId: objectId.required() }),
    [Segments.BODY]: Joi.object({ unitId: objectId.required(), order: Joi.number().integer() }),
  }),
  async (req, res) => {
    try {
      const { lessonId } = req.params
      const { unitId, order } = req.body
      const lesson = await LessonManager.assignUnitToLesson({ lessonId, unitId, order })
      res.send(lesson)
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message })
    }
  }
)

router.post(
  '/:lessonId/units/:unitId/lesson-materials',
  authorize('lessons', 'update'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ lessonId: objectId.required(), unitId: objectId.required() }),
    [Segments.BODY]: Joi.object({ lessonMaterialId: objectId.required(), order: Joi.number().integer() }),
  }),
  async (req, res) => {
    try {
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
  }
)

module.exports = router
