import elasticsearch from 'elasticsearch'

const esClient = new elasticsearch.Client({
  node: `${process.env.ELASTIC_HOST}`,
})

export default esClient
