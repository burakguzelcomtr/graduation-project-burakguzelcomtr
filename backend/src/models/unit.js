const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const unitSchema = new mongoose.Schema(
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
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      autopopulate: { maxDepth: 1 },
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'LessonMaterial',
          autopopulate: { maxDepth: 1 },
        },
        itemType: {
          type: String,
          enum: ['topic', 'quiz'],
        },
        order: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
)

unitSchema.plugin(autopopulate)

module.exports = mongoose.model('Unit', unitSchema)
