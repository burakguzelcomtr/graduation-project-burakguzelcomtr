const mongoose = require('mongoose')

const heroSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: 'heros' }
)

module.exports = mongoose.model('Hero', heroSchema)
