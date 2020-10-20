const mongoose = require('mongoose')

beforeAll(function (done) {
  connectMongoose(done)
})

afterAll(function () {
  mongoose.disconnect()
})

beforeEach(async () => {
  await clearDatabase()
})

function connectMongoose (done) {
  const mongooseOpts = {
    // options for mongoose 4.11.3 and above
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  }

  mongoose.connect(global.__MONGO_URI__, mongooseOpts)

  mongoose.connection.on('error', e => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e)
      mongoose.connect(global.__MONGO_URI__, mongooseOpts)
    }
    console.log(e)
  })

  mongoose.connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${global.__MONGO_URI__}`)
    done()
  })
}

async function clearDatabase () {
  return new Promise(resolve => {
    let cont = 0
    let max = Object.keys(mongoose.connection.collections).length
    for (const i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function () {
        cont++
        if (cont >= max) {
          resolve()
        }
      })
    }
  })
}
