const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const lessonMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      autopopulate: { maxDepth: 1 },
    },
    order: {
      type: Number,
    },
  },
  { timestamps: true, discriminatorKey: 'type' }
)

lessonMaterialSchema.plugin(autopopulate)

const topicSchema = new mongoose.Schema({
  content: {
    type: String,
  },
})

const quizSchema = new mongoose.Schema({
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      autopopulate: { maxDepth: 1 },
    },
  ],
  passingScorePercent: {
    type: Number,
  },
})

const LessonMaterial = mongoose.model('LessonMaterial', lessonMaterialSchema)
const Topic = LessonMaterial.discriminator('topic', topicSchema)
const Quiz = LessonMaterial.discriminator('quiz', quizSchema)

LessonMaterial.Topic = Topic
LessonMaterial.Quiz = Quiz

module.exports = LessonMaterial
