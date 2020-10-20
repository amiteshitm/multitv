import _ from 'lodash'
import Mutation from 'server/graph/mutations'
import Query from 'server/graph/resolvers/query'
import CategoryPath from 'server/graph/resolvers/category_path'
import Feature from 'server/graph/resolvers/feature'

_.merge(Query, { Mutation }, CategoryPath, Feature)

export default Query
