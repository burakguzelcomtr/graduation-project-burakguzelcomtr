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
  classGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassGroup',
    autopopulate: { maxDepth: 1 },
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
