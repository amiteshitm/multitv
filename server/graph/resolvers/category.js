import { schemaComposer } from 'graphql-compose'

import { CategoryTC } from 'server/models/category'

function addCategoryResolvers () {
  schemaComposer.Query.addFields({
    categoryOne: CategoryTC.getResolver('findOne'),
    categoryMany: CategoryTC.getResolver('findMany'),
  })
  createCustomResolvers()
  createRelations()
}

function createCustomResolvers () {
  // TODO: Check if features need to be moved into relation once all is done.
  CategoryTC.addFields({
    features: {
      type: '[Feature]',
      resolve: async obj => {
        const f = await obj.populate('features').execPopulate()

        return f.features
      },
      projection: { features: 1 },
    },
  })
}

function createRelations () {
  // Childre
  CategoryTC.addRelation('children', {
    resolver: () => CategoryTC.get('$findByIds'),
    prepareArgs: {
      _ids: source => source.children,
    },
    projection: { children: 1 },
  })
}

export { addCategoryResolvers }
