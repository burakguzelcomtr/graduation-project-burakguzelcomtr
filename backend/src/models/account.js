const mongoose = require('mongoose')
const passportLocalMongooseModule = require('passport-local-mongoose')

const passportLocalMongoose = passportLocalMongooseModule.default || passportLocalMongooseModule

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

accountSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('Account', accountSchema)
