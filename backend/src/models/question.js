const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LessonMaterial',
      required: true,
    },
    answers: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswers: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      default: [],
      select: false,
    },
    type: {
      type: String,
      required: true,
      enum: ['multiple-choice', 'true-false', 'short-answer'],
    },
  },
  { timestamps: true }
)

questionSchema.plugin(autopopulate)

module.exports = mongoose.model('Question', questionSchema)
