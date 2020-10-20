import { Strategy as LocalStrategy } from 'passport-local'
import User from 'server/models/user'

import getConfig from 'next/config'

const jwt = require('jsonwebtoken')

module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  },
  (req, email, password, done) => {
    const userData = {
      email: email.trim(),
      password: password.trim(),
    }
    // find a user by email address
    return User.findOne({ email: userData.email }, (err, user) => {
      if (err) {
        return done(err)
      }

      if (!user) {
        const error = new Error('Incorrect email or password')
        error.name = 'IncorrectCredentialsError'
        return done(error)
      }
      // check if a hashed user's password is equal to a value saved in the database
      return user.comparePassword(userData.password, (passwordErr, isMatch) => {
        if (err) {
          return done(err)
        }

        if (!isMatch) {
          const error = new Error('Incorrect email or password')
          error.name = 'IncorrectCredentialsError'
          return done(error)
        }
        const payload = {
          email: user.email,
          role: user.role,
        }
        // create a token string
        const token = jwt.sign(payload, getConfig().serverRuntimeConfig.jwtSecret, { expiresIn: '2d' })
        const { name, email, role } = user
        const data = {
          name,
          email,
          role,
        }
        return done(null, token, data)
      })
    })
  }
)
