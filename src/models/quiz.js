const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true,
  },
  // question includes question ids from questions collection
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      autopopulate: { maxDepth: 1 },
    },
  ],
  content: {
    type: String,
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

quizSchema.plugin(autopopulate)

module.exports = mongoose.model('Quiz', quizSchema)
