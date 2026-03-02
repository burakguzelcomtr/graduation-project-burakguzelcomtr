const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const topicSchema = new mongoose.Schema({
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

topicSchema.plugin(autopopulate)

module.exports = mongoose.model('Topic', topicSchema)
