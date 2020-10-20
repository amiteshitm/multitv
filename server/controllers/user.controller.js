import passport from 'passport'

import getConfig from 'next/config'

import User from 'server/models/user'

const validator = require('validator')
const jwt = require('jsonwebtoken')

function validateForm (payload) {
  const errors = {}
  let isFormValid = true
  let message = ''

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false
    errors.email = 'Invalid email/password'
  }

  if (!payload || typeof payload.password !== 'string') {
    isFormValid = false
    errors.password = 'Invalid email/password'
  }

  if (!isFormValid) {
    message = 'Invalid email/password'
  }

  return {
    success: isFormValid,
    message,
    errors,
  }
}

exports.login = function (req, res, next) {
  const validationResult = validateForm(req.body)
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors,
    })
  }
  return passport.authenticate('localLogin', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message,
        })
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.',
      })
    }

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // on HTTPS
    })

    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      user: userData,
    })
  })(req, res, next)
}

exports.logout = (req, res, next) => {
  res.clearCookie('jwt')

  return res.status(200).json({ success: true })
}

exports.loginFromToken = function (req, res, next) {
  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers.authorization.split(' ')[1]
  const { serverRuntimeConfig } = getConfig()

  if (!token) {
    return res.status(401).json({
      message: 'Must pass token',
    })
  }

  // decode token
  jwt.verify(token, serverRuntimeConfig.jwtSecret, function (err, decoded) {
    if (err) {
      throw err
    }

    // return user using the id from w/in JWTToken
    if (err) {
      return res.status(401).end()
    }

    const email = decoded.email

    // check if a user exists
    return User.find({ email }, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end()
      }

      return res.json({
        success: true,
        token,
        user,
      })
    })
  })
}

// -------------------------------------------

exports.register = function (req, res, next) {
  const validationResult = validateForm(req.body)
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors,
    })
  }
  const { serverRuntimeConfig } = getConfig()

  return passport.authenticate('localSignup', (err, userData) => {
    if (err) {
      if (err.errors.email.kind === 'unique') {
        return res.status(409).json({
          success: false,
          message: 'This email is already taken.',
          errors: {}, // this should be removed
        })
      }
      return res.status(200).json({
        success: false,
        message: 'Could not process the form.',
      })
    }
    // token generation
    const payload = { sub: userData.email }
    const token = jwt.sign(payload, serverRuntimeConfig.jwtSecret, { expiresIn: '21 days' })
    // let mail = {
    //   from: 'no-reply@bodhik.com',
    //   to: userData.email,
    //   subject: 'Email Verification - Sip a Coin',
    //   template: 'verifyEmail',
    //   context: {
    //     token,
    //     userData,
    //   },
    // }
    // nodeMailerQ(mail, 'mails')
    return res.status(200).json({
      success: true,
      token,
      message: 'You have successfully signed up!',
    })
  })(req, res, next)
}
// verfiy Email
exports.verifyEmail = function (req, res, next) {
  if (!req.query.token) {
    return res
      .status(401)
      .json({ message: 'Invalid Request' })
      .end()
  }
  const token = req.query.token
  return jwt.verify(token, Confippet.config.jwtSecret, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json('Token Expired/Invalid Token')
        .end()
    }
    const userEmail = decoded.sub
    return User.findOneAndUpdate({ email: userEmail }, { $set: { isConfirmed: true } }, (userErr, user) => {
      if (userErr || !user) {
        return res
          .status(401)
          .json({ message: 'error' })
          .end()
      }
      return res.redirect('/')
    })
  })
}
exports.google = function (req, res, next) {
  return passport.authenticate(
    'google',
    {
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    },
    err => {
      if (err) return res.status(401).end()
      return res.json({
        success: true,
        message: 'You have successfully logged in!',
      })
    }
  )(req, res, next)
}
exports.googleAuth = function (req, res, next) {
  passport.authenticate(
    'google',
    {
      // successRedirect: `/socialAuth/${token}`,
      failureRedirect: '/user/signin',
    },
    (err, user) => {
      if (err) return res.redirect(`/user/signin`)
      const token = jwt.sign({ sub: user._id, role: user.role }, Confippet.config.jwtSecret)
      if (user.role == 'admin') return res.redirect(`/socialAuth/${token}/admin`)
      else return res.redirect(`/socialAuth/${token}`)
    }
  )(req, res, next)
}
