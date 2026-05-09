const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
require('./hero')
require('./country')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, discriminatorKey: 'role' }
)

userSchema.plugin(autopopulate)

const studentSchema = new mongoose.Schema({
  studentId: {
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
  campus: {
    type: String,
    required: true,
  },
  hero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hero',
    autopopulate: true,
    default: null,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    autopopulate: true,
    default: null,
  },
})

const teacherSchema = new mongoose.Schema({
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
})

// Ensure only one teacher exists per grade+section+campus.
userSchema.index({ grade: 1, section: 1, campus: 1 }, { unique: true, partialFilterExpression: { role: 'teacher' } })

const adminSchema = new mongoose.Schema({})

const User = mongoose.model('User', userSchema)
const Student = User.discriminator('student', studentSchema)
const Teacher = User.discriminator('teacher', teacherSchema)
const Admin = User.discriminator('admin', adminSchema)

User.Student = Student
User.Teacher = Teacher
User.Admin = Admin

module.exports = User
