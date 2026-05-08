const Question = require('../models/question')

class QuestionManager {
  static async getQuestionById(questionId, { includeCorrectAnswers = false } = {}) {
    const query = Question.findById(questionId)

    if (includeCorrectAnswers) {
      query.select('+correctAnswers')
    }

    const question = await query
    if (!question) {
      const error = new Error('Question not found')
      error.status = 404
      throw error
    }
    return question
  }

  static async getQuestionsByQuiz(quizId, { includeCorrectAnswers = false } = {}) {
    const query = Question.find({ quiz: quizId })

    if (includeCorrectAnswers) {
      query.select('+correctAnswers')
    }

    return query
  }

  static async createQuestion({ question, type, answers, correctAnswers, quizId }) {
    if (!question || !type || !quizId) {
      const error = new Error('Missing required fields')
      error.status = 400
      throw error
    }

    const validTypes = ['multiple-choice', 'true-false', 'short-answer']
    if (!validTypes.includes(type)) {
      const error = new Error('Invalid question type')
      error.status = 400
      throw error
    }

    return Question.create({
      question,
      type,
      answers: answers ?? [],
      correctAnswers: correctAnswers ?? [],
      quiz: quizId,
    })
  }

  static async updateQuestion({ questionId, question, type, answers, correctAnswers }) {
    const existing = await this.getQuestionById(questionId, { includeCorrectAnswers: true })

    if (type !== undefined) {
      const validTypes = ['multiple-choice', 'true-false', 'short-answer']
      if (!validTypes.includes(type)) {
        const error = new Error('Invalid question type')
        error.status = 400
        throw error
      }
      existing.type = type
    }

    if (question !== undefined) existing.question = question
    if (answers !== undefined) existing.answers = answers
    if (correctAnswers !== undefined) existing.correctAnswers = correctAnswers

    await existing.save()
    return existing
  }

  static async deleteQuestion(questionId) {
    const question = await this.getQuestionById(questionId, { includeCorrectAnswers: true })
    await Question.findByIdAndDelete(question.id)
    return question
  }

  static normalizeAnswer(answer) {
    return String(answer ?? '')
      .trim()
      .toLowerCase()
  }

  static async validateQuestionAnswer({ questionId, answer }) {
    const normalizedAnswer = this.normalizeAnswer(answer)
    if (!normalizedAnswer) {
      const error = new Error('Answer is required')
      error.status = 400
      throw error
    }

    const question = await this.getQuestionById(questionId, { includeCorrectAnswers: true })
    const acceptedAnswers = (question.correctAnswers ?? []).map(this.normalizeAnswer).filter(Boolean)

    return {
      isCorrect: acceptedAnswers.length === 0 || acceptedAnswers.includes(normalizedAnswer),
    }
  }
}

module.exports = QuestionManager
