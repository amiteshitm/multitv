import { schemaComposer } from 'graphql-compose'
import { makeExecutableSchema, PubSub } from 'apollo-server-express'

import resolvers from 'server/graph/resolvers'
import { typeDefs } from 'server/graph/types/defs'
import types from 'server/graph/types'
import schemaDirectives from 'server/graph/directives'
import { addMongooseMutations } from 'server/graph/mutations/mongoose'
import { addMongooseResolvers } from 'server/graph/resolvers/mongoose'

const pubsub = new PubSub()

const apolloSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives,
})

// schemaComposer.addTypeDefs(typeDefs)
// schemaComposer.addResolveMethods(resolvers)

schemaComposer.Query.addFields(types)

addMongooseMutations()
addMongooseResolvers()

// Problems in stitching schemas.
// 1. We need graphql-compose-elastic and graphql-compose-mongoose so we will need graphql-compose schema
// 2. We need directives from graphql-tools
// 3. So we stich both the schemas.
// 4. The problem is that new schema comes with Subscription having empty field, so we create a dummy
// Subscription field.
// 5. mergeSchemas from graphql-tools has problem with enum types and graphql-compose-elastic uses
// tons of that, so we use merge from graphql-compose.

schemaComposer.Subscription.addFields({
  softwareUpdate: {
    type: 'Software',
    resolve: payload => {
      return payload.softwareUpdate
    },
    subscribe: () => pubsub.asyncIterator('softwareUpdate'),
  },
})

schemaComposer.merge(apolloSchema)

export default schemaComposer.buildSchema()
