const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const lessonSchema = new mongoose.Schema({
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
  ],
  type: {
    type: String,
    enum: ['main', 'premun'],
    default: 'main',
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

lessonSchema.plugin(autopopulate)

module.exports = mongoose.model('Lesson', lessonSchema)
