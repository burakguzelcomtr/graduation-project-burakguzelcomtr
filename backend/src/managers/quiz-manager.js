class QuizManager {
  addQuestionToQuiz({ quiz, question }) {
    if (quiz.type !== 'quiz') {
      throw new Error('Provided material is not a quiz')
    }
    quiz.content.push(question)
  }
}
module.exports = QuizManager