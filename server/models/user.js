let bcrypt = require('bcrypt')
let mongoose = require('mongoose')
let uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: String,
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    gid: String,
    name: {
      first: { type: String },
      last: { type: String },
    },
    last_name: {
      type: String,
    },
    role: { type: String, enum: ['user', 'admin', 'moderator', 'su'], default: 'user' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

UserSchema.plugin(uniqueValidator)

const fullname = UserSchema.virtual('name.full')

fullname.get(function () {
  return this.name.first + ' ' + this.name.last
})

UserSchema.methods.comparePassword = function comparePassword (password, callback) {
  bcrypt.compare(password, this.password, callback)
}

UserSchema.methods.hasRole = function hasRole (role) {
  return [role.toLowerCase(), 'su'].includes(this.role)
}

UserSchema.pre('save', function saveHook (next) {
  const user = this
  if (!user.isModified('password')) return next()
  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) {
      return next(saltError)
    }
    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) {
        return next(hashError)
      }
      user.password = hash
      return next()
    })
  })
})
module.exports = mongoose.model('User', UserSchema)
