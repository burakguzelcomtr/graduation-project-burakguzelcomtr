const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const lessonMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['topic', 'quiz'],
      required: true,
    },
    content: {
      type: String,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      autopopulate: { maxDepth: 1 },
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        autopopulate: { maxDepth: 1 },
        required() {
          return this.type === 'quiz'
        },
      },
    ],
    order: {
      type: Number,
    },
    passingScorePercent: {
      type: Number,
    },
  },
  { timestamps: true }
)

lessonMaterialSchema.plugin(autopopulate)

module.exports = mongoose.model('LessonMaterial', lessonMaterialSchema)
