const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
})
userSchema.plugin(autopopulate)

// Ensure only one teacher exists per grade+section. Students may share grade+section.
userSchema.index({ grade: 1, section: 1 }, { unique: true, partialFilterExpression: { role: 'teacher' } })

// Log index build errors so failures don't stay silent
userSchema.post('index', function (error) {
  if (error) console.error('User index error:', error)
})

class User {
  constructor({ name, surname, grade, section, role = 'student' }) {
    this.name = name
    this.surname = surname
    this.grade = grade
    this.section = section
    this.role = role
  }
}

userSchema.loadClass(User)
module.exports = mongoose.model('User', userSchema)
