/*
 ** we should probably start ApolloServer in environment file however ES6 constructs are not working
 ** there somehow.
 */
import schema from 'server/graph/schema'
import context from 'server/context'
import { ApolloServer } from 'apollo-server-express'

const { HttpLink } = require('apollo-link-http')
const fetch = require('node-fetch')
const { execute } = require('apollo-link')

jest.mock('server/context', () => ({
  user: {
    name: 'First Name',
    hasRole: jest.fn(() => true),
  },
}))

const constructTestServer = () => {
  const server = new ApolloServer({
    schema,
    context,
    cors: false,
  })

  return { server }
}

const startTestServer = async server => {
  // if using apollo-server-express...
  // const app = express();
  // server.applyMiddleware({ app });
  // const httpServer = await app.listen(0);

  const httpServer = await server.listen({ port: 0 })

  const link = new HttpLink({
    uri: `http://localhost:${httpServer.port}`,
    fetch,
  })

  const executeOperation = ({ query, variables = {} }) => execute(link, { query, variables })

  return {
    link,
    stop: () => httpServer.server.close(),
    graphql: executeOperation,
  }
}

module.exports = { constructTestServer, startTestServer }
