const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const unitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    autopopulate: { maxDepth: 1 },
  },
  items: [
    {
      itemType: {
        type: String,
        enum: ['Topic', 'Quiz'],
        required: true,
      },
      item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'items.itemType',
        autopopulate: { maxDepth: 1 },
      },
    },
  ],
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

unitSchema.plugin(autopopulate)

module.exports = mongoose.model('Unit', unitSchema)
