import getConfig from 'next/config'

const mongoose = require('mongoose')

export function connectDatabase () {
  const {
    serverRuntimeConfig: {
      database: { username, password, name },
    },
  } = getConfig()

  mongoose.connect(`mongodb://${username}:${password}@localhost:27017/${name}?authSource=admin`)
  mongoose.set('debug', process.env.NODE_ENV !== 'production')
}
