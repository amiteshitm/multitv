/* Initializing PassportJS */
import localLogin from './passport-strategies/local-login'
import localSignup from './passport-strategies/local-signup'

module.exports = function (passport) {
  // strategies
  passport.use('localLogin', localLogin)
  passport.use('localSignup', localSignup)
}
