const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
    },
    classGroups: [
      {
        type: String,
      },
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

lessonSchema.index({ classGroups: 1 })

lessonSchema.plugin(autopopulate)

module.exports = mongoose.model('Lesson', lessonSchema)
