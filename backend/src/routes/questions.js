const express = require('express')

const router = express.Router()

const { celebrate, Joi, Segments } = require('celebrate')
const authorize = require('../middleware/authorize')
const QuestionManager = require('../managers/question-manager')
const QuizManager = require('../managers/quiz-manager')

const objectId = Joi.string().hex().length(24)

/* POST create a question and add it to a quiz. */
router.post(
  '/',
  authorize('questions', 'create'),
  celebrate({
    [Segments.BODY]: Joi.object({
      question: Joi.string().required(),
      type: Joi.string().required(),
      answers: Joi.array().required(),
      correctAnswers: Joi.array().required(),
      quizId: objectId.required(),
    }),
  }),
  async (req, res) => {
  try {
    const { question, type, answers, correctAnswers, quizId } = req.body
    const created = await QuestionManager.createQuestion({ question, type, answers, correctAnswers, quizId })
    await QuizManager.addQuestionToQuiz({ lessonMaterialId: quizId, questionId: created.id })
    res.status(201).send(created)
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message })
  }
})

/* GET all questions for a quiz. */
router.get(
  '/',
  authorize('questions', 'read'),
  celebrate({ [Segments.QUERY]: Joi.object({ quizId: objectId.required() }) }),
  async (req, res) => {
  try {
    const { quizId } = req.query
    if (!quizId) {
      return res.status(400).send({ error: 'quizId query param is required' })
    }
    const questions = await QuestionManager.getQuestionsByQuiz(quizId)
    return res.send(questions)
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

/* POST validate a submitted answer for a question. */
router.post(
  '/:id/validate',
  authorize('questions', 'read'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: objectId.required() }),
    [Segments.BODY]: Joi.object({ answer: Joi.any().required() }),
  }),
  async (req, res) => {
  try {
    const result = await QuestionManager.validateQuestionAnswer({
      questionId: req.params.id,
      answer: req.body?.answer,
    })
    res.send(result)
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message })
  }
})

/* GET a single question by id. */
router.get(
  '/:id',
  authorize('questions', 'read'),
  celebrate({ [Segments.PARAMS]: Joi.object({ id: objectId.required() }) }),
  async (req, res) => {
  try {
    const question = await QuestionManager.getQuestionById(req.params.id)
    res.send(question)
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message })
  }
})

/* PATCH update a question. */
router.patch(
  '/:id',
  authorize('questions', 'update'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: objectId.required() }),
    [Segments.BODY]: Joi.object({
      question: Joi.string(),
      type: Joi.string(),
      answers: Joi.array(),
      correctAnswers: Joi.array(),
    }),
  }),
  async (req, res) => {
  try {
    const { question, type, answers, correctAnswers } = req.body
    const updated = await QuestionManager.updateQuestion({
      questionId: req.params.id,
      question,
      type,
      answers,
      correctAnswers,
    })
    res.send(updated)
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message })
  }
})

/* DELETE a question. */
router.delete(
  '/:id',
  authorize('questions', 'delete'),
  celebrate({ [Segments.PARAMS]: Joi.object({ id: objectId.required() }) }),
  async (req, res) => {
  try {
    const deleted = await QuestionManager.deleteQuestion(req.params.id)
    res.send(deleted)
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message })
  }
})

module.exports = router
