const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    classGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassGroup',
        autopopulate: {
          maxDepth: 2,
          select: 'grade section campus',
        },
      },
      // TODO : add index for classGroups to optimize queries filtering by class group, e.g. find lessons for a specific campus-grade-section combination. Use recht.
    ],
    type: {
      type: String,
      enum: ['main', 'premun'],
      default: 'main',
    },
    order: {
      type: Number,
    },
  },
  { timestamps: true }
)

lessonSchema.plugin(autopopulate)

module.exports = mongoose.model('Lesson', lessonSchema)
