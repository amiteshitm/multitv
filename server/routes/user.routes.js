import { Router } from 'express'
import { login, register, verifyEmail, loginFromToken, logout } from 'server/controllers/user.controller'
const router = new Router()

// login user
router.route('/login').post(login)
router.route('/token').get(loginFromToken)
router.route('/register').post(register)
router.route('/verify').get(verifyEmail)
router.route('/logout').post(logout)

module.exports = router
