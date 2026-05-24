const express = require('express')

const router = express.Router()

const { celebrate, Joi, Segments } = require('celebrate')
const authorize = require('../middleware/authorize')
const LessonMaterialManager = require('../managers/lesson-material-manager')
const QuizManager = require('../managers/quiz-manager')

const objectId = Joi.string().hex().length(24)

/* GET lesson materials listing. */
router.get(
  '/',
  authorize('lesson-materials', 'read'),
  celebrate({ [Segments.QUERY]: Joi.object({ unitId: objectId }) }),
  async (req, res) => {
    try {
      const { unitId } = req.query
      const lessonMaterials = await LessonMaterialManager.getLessonMaterials({ unitId })
      res.send(lessonMaterials)
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* POST create a new lesson material. */
router.post(
  '/',
  authorize('lesson-materials', 'create'),
  celebrate({
    [Segments.BODY]: Joi.object({
      title: Joi.string().required(),
      type: Joi.string().required(),
      content: Joi.any(),
      passingScorePercent: Joi.number().min(0).max(100),
    }),
  }),
  async (req, res) => {
    try {
      const { title, type, content, passingScorePercent } = req.body
      const lessonMaterial = await LessonMaterialManager.createLessonMaterial({
        title,
        type,
        content,
        passingScorePercent,
      })

      res.status(201).send(lessonMaterial)
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* GET a single lesson material by id. */
router.get(
  '/:id',
  authorize('lesson-materials', 'read'),
  celebrate({ [Segments.PARAMS]: Joi.object({ id: objectId.required() }) }),
  async (req, res) => {
    try {
      const lessonMaterial = await LessonMaterialManager.getLessonMaterialById(req.params.id)
      res.send(lessonMaterial)
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* PATCH update a lesson material. */
router.patch(
  '/:id',
  authorize('lesson-materials', 'update'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: objectId.required() }),
    [Segments.BODY]: Joi.object({
      title: Joi.string(),
      content: Joi.any(),
      passingScorePercent: Joi.number().min(0).max(100),
      order: Joi.number().integer(),
    }),
  }),
  async (req, res) => {
    try {
      const { id } = req.params
      const { title, content, passingScorePercent, order } = req.body
      const lessonMaterial = await LessonMaterialManager.updateLessonMaterial({
        lessonMaterialId: id,
        title,
        content,
        passingScorePercent,
        order,
      })

      res.send(lessonMaterial)
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* DELETE a lesson material. */
router.delete(
  '/:id',
  authorize('lesson-materials', 'delete'),
  celebrate({ [Segments.PARAMS]: Joi.object({ id: objectId.required() }) }),
  async (req, res) => {
    try {
      const { id } = req.params
      const deletedLessonMaterial = await LessonMaterialManager.deleteLessonMaterial(id)
      res.send(deletedLessonMaterial)
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* POST add a question to a quiz. */
router.post(
  '/:id/questions',
  authorize('lesson-materials', 'update'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: objectId.required() }),
    [Segments.BODY]: Joi.object({ questionId: objectId.required() }),
  }),
  async (req, res) => {
    try {
      const { questionId } = req.body
      const lessonMaterial = await QuizManager.addQuestionToQuiz({
        lessonMaterialId: req.params.id,
        questionId,
      })
      res.status(201).send(lessonMaterial)
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message })
    }
  }
)

/* DELETE remove a question from a quiz. */
router.delete(
  '/:id/questions/:questionId',
  authorize('lesson-materials', 'update'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: objectId.required(), questionId: objectId.required() }),
  }),
  async (req, res) => {
    try {
      const lessonMaterial = await QuizManager.removeQuestionFromQuiz({
        lessonMaterialId: req.params.id,
        questionId: req.params.questionId,
      })
      res.send(lessonMaterial)
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message })
    }
  }
)

module.exports = router
