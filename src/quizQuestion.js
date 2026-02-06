class Question {
  constructor({ id = null, text, type, options = [], correctAnswer = null, requiresApproval = false } = {}) {
    this.id = id
    this.text = text
    this.type = type
    this.options = options
    this.correctAnswer = correctAnswer
    this.requiresApproval = requiresApproval
  }
}

module.exports = Question
