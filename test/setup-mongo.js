import { MongoMemoryServer } from 'mongodb-memory-server'
const mongoose = require('mongoose')

let mongod

before(async function () {
  mongod = new MongoMemoryServer({
    // debug: true,
    autoStart: false,
  })

  await mongod.start()
  const mongoUri = await mongod.getConnectionString()

  // Setup Mongoose
  const mongooseOpts = {
    // options for mongoose 4.11.3 and above
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  }

  mongoose.connect(mongoUri, mongooseOpts)

  mongoose.connection.on('error', e => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e)
      mongoose.connect(mongoUri, mongooseOpts)
    }
    console.log(e)
  })

  mongoose.connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`)
  })
})

after(async function () {
  mongoose.connection.close()
  await mongod.stop()
})
