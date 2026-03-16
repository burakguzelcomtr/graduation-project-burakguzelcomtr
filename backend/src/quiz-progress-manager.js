const QuizProgress = require('./quiz-progress')
const generateId = require('./id-generator')

class QuizProgressManager {
  constructor() {
    this.quizProgresses = []
  }

  createQuizProgress({ quizId, studentId }) {
    const progress = new QuizProgress({ id: generateId(), quizId, studentId })
    this.quizProgresses.push(progress)
    return progress
  }

  getProgressByQuizAndStudent({ quizId, studentId }) {
    return this.quizProgresses.find(progress => progress.quizId === quizId && progress.studentId === studentId)
  }

  getQuizProgress({ quizId, studentId }) {
    let progress = this.getProgressByQuizAndStudent({ quizId, studentId })
    if (!progress) {
      progress = this.createQuizProgress({ quizId, studentId })
    }
    return progress
  }

  resetQuizProgress({ quizProgress }) {
    quizProgress.resetQuiz()
  }

  answerQuizQuestion({ quiz, student, questionId, answer }) {
    const question = this.getQuestionFromQuiz({ quiz, questionId })
    const isCorrect = this.checkAnswer({ question, answer })
    const progress = this.getQuizProgress({ quizId: quiz.id, studentId: student.id })
    progress.startQuiz()
    progress.answerQuestion({ questionId, answer, isCorrect })
    const totalQuestions = quiz.content.length
    if (this.isQuizComplete({ progress, totalQuestions })) {
      const score = this.calculateScore({ questions: progress.questions, totalQuestions })
      const passingScorePercent = this.getPassingScorePercent({ quiz })
      const passed = score >= passingScorePercent
      progress.completeQuiz({ score, passed })
      return { isCorrect, isComplete: true, score, passed }
    }
    return { isCorrect, isComplete: false }
  }

  isQuizComplete({ progress, totalQuestions }) {
    if (!progress) {
      return false
    }
    return progress.questions.length === totalQuestions
  }

  calculateScore({ questions, totalQuestions }) {
    if (totalQuestions === 0) {
      return 0
    }
    const correctCount = questions.filter(q => q.isCorrect).length
    return Math.round((correctCount / totalQuestions) * 100)
  }

  getQuestionFromQuiz({ quiz, questionId }) {
    if (!quiz || !Array.isArray(quiz.content)) {
      throw new Error('Quiz content is not available')
    }
    const question = quiz.content.find(q => q.id === questionId)
    if (!question) {
      throw new Error('Question not found')
    }
    return question
  }

  checkAnswer({ question, answer }) {
    if (question.type !== 'multiple-choice' && question.type !== 'single-choice') {
      throw new Error('Unsupported question type. Allowed types are multiple-choice and single-choice.')
    }
    return this.compareSingleAnswer({ correct: question.correctAnswer, answer })
  }

  compareSingleAnswer({ correct, answer }) {
    return correct === answer
  }

  getPassingScorePercent({ quiz }) {
    if (typeof quiz.passingScorePercent === 'number') {
      return quiz.passingScorePercent
    }
    return 60
  }
}

module.exports = QuizProgressManager
