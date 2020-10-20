import elasticsearch from 'elasticsearch'
import { composeWithElastic } from 'graphql-compose-elasticsearch'

import mapping from 'shared/elastic/mapping'

require('dotenv').config()

const SoftwareElasticTC = composeWithElastic({
  graphqlTypeName: 'SoftwareES',
  elasticIndex:
    process.env.NODE_ENV === 'test'
      ? 'softwares_test'
      : process.env.ELASTIC_INDEX_ALIAS,
  elasticType: 'software',
  elasticMapping: mapping,
  elasticClient: new elasticsearch.Client({
    host: `${process.env.ELASTIC_HOST}`,
    apiVersion: '7.3',
    log: 'trace'
  }),
  // elastic mapping does not contain information about is fields are arrays or not
  // so provide this information explicitly for obtaining correct types in GraphQL
  pluralFields: ['categories', 'uploads', 'logo', 'tags']
})

export default {
  softwareES: SoftwareElasticTC.getResolver('search').getFieldConfig(),
  softwarePagination: SoftwareElasticTC.getResolver(
    'searchPagination'
  ).getFieldConfig(),
  softwareConnection: SoftwareElasticTC.getResolver(
    'searchConnection'
  ).getFieldConfig()
}
