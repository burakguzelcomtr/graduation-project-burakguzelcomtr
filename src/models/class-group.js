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
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: { maxDepth: 1 },
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: { maxDepth: 1 },
    },
  ],
})
classGroupSchema.index({ grade: 1, section: 1 }, { unique: true }) // Ensure unique grade+section combinations for class groups
classGroupSchema.plugin(autopopulate)

class ClassGroup {}

classGroupSchema.loadClass(ClassGroup)
module.exports = mongoose.model('ClassGroup', classGroupSchema)
