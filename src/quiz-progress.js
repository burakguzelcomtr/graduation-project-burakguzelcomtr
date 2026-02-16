class QuizProgress {
  constructor({ id, quizId, studentId }) {
    this.id = id
    this.quizId = quizId
    this.studentId = studentId
    this.status = null
    this.score = null
    this.passed = null
    this.questions = []
    this.startedAt = null
    this.completedAt = null
  }

  startQuiz() {
    if (!this.startedAt) {
      this.startedAt = new Date()
      this.status = 'in_progress'
    }
  }

  completeQuiz({ score, passed }) {
    if (!this.startedAt) {
      throw new Error('Quiz has not been started yet')
    }
    this.completedAt = new Date()
    this.status = passed ? 'completed' : 'failed'
    this.score = score
    this.passed = passed
  }

  getQuizProgress() {
    return {
      quizId: this.quizId,
      status: this.status,
      score: this.score,
      passed: this.passed,
      questions: this.questions,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
    }
  }

  resetQuiz() {
    this.status = null
    this.score = null
    this.passed = null
    this.questions = []
    this.startedAt = new Date()
    this.completedAt = null
  }

  answerQuestion({ questionId, answer, isCorrect }) {
    if (!this.startedAt) {
      throw new Error('Quiz has not been started yet')
    }
    const answeredQuestion = this.questions.find(q => q.questionId === questionId)
    if (answeredQuestion) {
      answeredQuestion.answeredAt = new Date()
      answeredQuestion.answer = answer
      answeredQuestion.isCorrect = isCorrect
    } else {
      this.questions.push({ questionId, answeredAt: new Date(), answer, isCorrect })
    }
  }

  getQuestionProgress({ questionId }) {
    return this.questions.find(q => q.questionId === questionId)
  }
}

module.exports = QuizProgress
