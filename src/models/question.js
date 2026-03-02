const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswers: [
    {
      type: String,
      required: true,
    },
  ],
  type: {
    type: String,
    required: true,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
  },
  order: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

questionSchema.plugin(autopopulate)

module.exports = mongoose.model('Question', questionSchema)
