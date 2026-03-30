const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
// TODO : Will be removed and this data will be stored in user model
const classGroupSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
)
classGroupSchema.index({ grade: 1, section: 1, campus: 1 }, { unique: true }) // Ensure unique grade+section+campus combinations for class groups
classGroupSchema.plugin(autopopulate)

module.exports = mongoose.model('ClassGroup', classGroupSchema)
