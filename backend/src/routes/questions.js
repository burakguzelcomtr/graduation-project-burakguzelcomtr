const express = require('express')

const router = express.Router()

const QuestionManager = require('../managers/question-manager')
const QuizManager = require('../managers/quiz-manager')

/* POST create a question and add it to a quiz. */
router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
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

/* GET a single question by id. */
router.get('/:id', async (req, res) => {
  try {
    const question = await QuestionManager.getQuestionById(req.params.id)
    res.send(question)
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message })
  }
})

/* PATCH update a question. */
router.patch('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await QuestionManager.deleteQuestion(req.params.id)
    res.send(deleted)
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message })
  }
})

module.exports = router
