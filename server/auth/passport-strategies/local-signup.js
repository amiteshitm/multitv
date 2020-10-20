import { Strategy as LocalStrategy } from 'passport-local'
import User from 'server/models/user'
module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false, // session is false because we are using json web tokens
    passReqToCallback: true,
  },
  (req, email, password, done) => {
    const userData = {
      email: email.trim(),
      password: password.trim(),
    }

    const newUser = new User(userData)
    newUser.save(err => {
      if (err) {
        return done(err, null)
      }
      return done(null, userData)
    })
  }
)
