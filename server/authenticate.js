import getConfig from 'next/config'

import User from 'server/models/user'

const jwt = require('jsonwebtoken')

const authenticate = async token => {
  const { serverRuntimeConfig } = getConfig()
  let decoded = null
  let user = null

  try {
    decoded = jwt.verify(token, serverRuntimeConfig.jwtSecret)
  } catch (err) {}

  if (decoded) {
    const { email } = decoded

    // check if a user exists
    user = await User.findOne({ email })
  }

  return user
}

export default authenticate
