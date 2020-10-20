import _ from 'lodash'

import { schemaComposer } from 'graphql-compose'

import { SoftwareTC } from 'server/models/software'
import { CategoryTC } from 'server/models/category'

function addSoftwareResolvers () {
  schemaComposer.Query.addFields({
    softwareOne: SoftwareTC.getResolver('findOne'),
    softwareMany: SoftwareTC.getResolver('findMany'),
  })
  createCustomResolvers()
  createRelations()
  addSortArgs()
}

function createCustomResolvers () {
  // TODO: Check if features need to be moved into relation once all is done.
  SoftwareTC.addFields({
    logo: {
      type: 'Media',
      args: {
        aspect: 'String',
      },
      resolve: (obj, args, ctx, info) => _.filter(obj.logo, (l) => l.aspect === args.aspect)[0],
      projection: { uploads: 1 },
    },
    upload: {
      type: 'Media',
      args: {
        aspect: 'String',
      },
      resolve: (obj, args, ctx, info) => {
        return _.filter(obj.uploads, (l) => l.aspect === args.aspect)[0]
      },
      projection: { uploads: 1 },
    },
    features: {
      type: '[FeatureEmbed]',
      resolve: async (obj) => {
        const f = await obj.populate('features.feature').execPopulate()

        return f.features
      },
      projection: { features: 1 },
    },
  })
}

function createRelations () {
  // Root category
  SoftwareTC.addRelation('root_category', {
    resolver: () => CategoryTC.get('$findById'),
    prepareArgs: {
      _id: (source) => source.root_category_id,
    },
    projection: { root_category_id: 1 },
  })
}

function addSortArgs () {
  SoftwareTC.getResolver('findMany').addSortArg({
    name: 'UPDATED_AT_DESC',
    description: 'sort by updated_at Descending',
    value: { updated_at: -1 },
  })
}

export { addSoftwareResolvers }
