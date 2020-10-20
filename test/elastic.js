import esClient from 'server/lib/es_client'

beforeEach(async () => {
  await clearIndices()
})

async function clearIndices () {
  if (esClient.indices) {
    const exists = await esClient.indices.exists({ index: 'softwares_test' })

    if (exists) {
      await esClient.indices.delete({
        index: 'softwares_test',
      })
    }
  }
}
