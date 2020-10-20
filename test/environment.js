const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
const NodeEnvironment = require('jest-environment-node')

class AppEnvironment extends NodeEnvironment {
  constructor (config) {
    // console.error('\n# MongoDB Environment Constructor #\n');
    super(config)
    this.mongod = new MongoMemoryServer({
      // debug: true,
      autoStart: false,
    })
  }

  async setup () {
    await super.setup()
    await this.setupMongo()
  }

  async setupMongo () {
    // console.error('\n# MongoDB Environment Setup #\n');
    await this.mongod.start()
    this.global.__MONGO_URI__ = await this.mongod.getConnectionString()
    this.global.__MONGO_DB_NAME__ = await this.mongod.getDbName()
    this.global.__COUNTERS__ = {
      user: 0,
    }
  }

  async teardown () {
    await super.teardown()
    await this.mongod.stop()
    this.mongod = null
    this.global = {}
  }

  runScript (script) {
    return super.runScript(script)
  }
}

module.exports = AppEnvironment
