const LessonMaterialManager = require('./lesson-material-manager')

class QuizManager {
  static async addQuestionToQuiz({ lessonMaterialId, questionId }) {
    const quiz = await LessonMaterialManager.getLessonMaterialById(lessonMaterialId)

    if (quiz.type !== 'quiz') {
      const error = new Error('Lesson material is not a quiz')
      error.status = 400
      throw error
    }

    const alreadyAdded = quiz.questions.some(
      q => String(q) === String(questionId) || String(q.id) === String(questionId)
    )
    if (alreadyAdded) {
      const error = new Error('Question already added to this quiz')
      error.status = 400
      throw error
    }

    quiz.questions.push(questionId)
    await quiz.save()
    return quiz
  }

  static async removeQuestionFromQuiz({ lessonMaterialId, questionId }) {
    const quiz = await LessonMaterialManager.getLessonMaterialById(lessonMaterialId)

    if (quiz.type !== 'quiz') {
      const error = new Error('Lesson material is not a quiz')
      error.status = 400
      throw error
    }

    const lengthBefore = quiz.questions.length
    quiz.questions = quiz.questions.filter(q => String(q.id ?? q) !== String(questionId))

    if (quiz.questions.length === lengthBefore) {
      const error = new Error('Question not found in this quiz')
      error.status = 404
      throw error
    }

    await quiz.save()
    return quiz
  }
}

module.exports = QuizManager
