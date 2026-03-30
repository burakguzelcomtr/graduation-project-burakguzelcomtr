const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const passportLocalMongooseModule = require('passport-local-mongoose')

const passportLocalMongoose = passportLocalMongooseModule.default || passportLocalMongooseModule
// TODO : Add discriminator for rules and use lib hakki for role based access control
// TODO : Seperate account data and profile data into different models
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
    email: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required() {
        return this.role === 'student'
      }, // only required for students
    },
    grade: {
      type: Number,
      required() {
        return this.role !== 'admin'
      }, // not required for admin users, but required for students and teachers
    },
    section: {
      type: String,
      required() {
        return this.role !== 'admin'
      }, // not required for admin users, but required for students and teachers
    },
    campus: {
      type: String,
      required() {
        return this.role !== 'admin'
      }, // not required for admin users, but required for students and teachers
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    classGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassGroup',
      autopopulate: { maxDepth: 1, select: '-students' },
    },
  },
  { timestamps: true }
)
userSchema.plugin(autopopulate)
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

// Ensure only one teacher exists per grade+section+campus. Students may share grade+section+campus.
userSchema.index({ grade: 1, section: 1, campus: 1 }, { unique: true, partialFilterExpression: { role: 'teacher' } })

userSchema.post('index', error => {
  if (error) {
    console.error('Error building indexes for User schema:', error)
  }
})

module.exports = mongoose.model('User', userSchema)
