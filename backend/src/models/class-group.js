const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const classGroupSchema = new mongoose.Schema({
  grade: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  campus: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: { maxDepth: 1, select: 'name surname' },
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: { maxDepth: 1, select: '-name' },
    },
  ],
})
classGroupSchema.index({ grade: 1, section: 1, campus: 1 }, { unique: true }) // Ensure unique grade+section+campus combinations for class groups
classGroupSchema.plugin(autopopulate)

module.exports = mongoose.model('ClassGroup', classGroupSchema)
