const Question = require('../models/question')

class QuestionManager {
  static async getQuestionById(questionId) {
    const question = await Question.findById(questionId)
    if (!question) {
      const error = new Error('Question not found')
      error.status = 404
      throw error
    }
    return question
  }

  static async getQuestionsByQuiz(quizId) {
    return Question.find({ quiz: quizId })
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
    const existing = await this.getQuestionById(questionId)

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
    const question = await this.getQuestionById(questionId)
    await Question.findByIdAndDelete(question.id)
    return question
  }
}

module.exports = QuestionManager
