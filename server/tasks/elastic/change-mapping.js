const { Client } = require('elasticsearch')
const mapping = require('../../../shared/elastic/mapping').default

const client = new Client({ node: `${process.env.ELASTIC_HOST}` })

// To run the tasks first build using: webpack --mode development --config webpack.tasks.config.js
// or yarn run build-tasks in the root directory of project.
// Then run, jake -f dist/main.js esChangeMapping.

desc('The task updates the mapping with the latest mapping')
task('esChangeMapping', { async: true }, async function (params) {
  try {
    const oldIndexName = 'softwares'
    const newIndexName = 'softwares_v2'
    const aliasName = 'softwares_alias'

    // create alias.
    // Next time make softwares as alias and just keep changing the versions
    // of index with alias pointing to the version numbered index
    // e.g alias: softwares, index: softwares_v2
    await client.indices.putAlias({
      index: 'softwares',
      name: aliasName,
    })

    // step 2: create new index with new mapping.
    await client.indices.create({
      index: newIndexName,
    })

    let result = await client.indices.putMapping({
      index: newIndexName,
      type: 'software',
      include_type_name: true,
      body: mapping,
    })

    console.log('After putMapping')
    console.log(result)

    // Step: 3 Reindex into the new index
    result = await client.reindex({
      body: {
        source: {
          index: oldIndexName,
        },
        dest: {
          index: newIndexName,
        },
      },
    })

    console.log('After reindexing')
    console.log(result)

    // Step 4: Point the alias to the new index now.
    result = await client.indices.updateAliases({
      body: {
        actions: [
          { remove: { index: oldIndexName, alias: aliasName } },
          { add: { index: newIndexName, alias: aliasName } },
        ],
      },
    })

    console.log('After update aliases')
    console.log(result)
  } catch (err) {
    console.log(err.message)
  } finally {
    this.complete()
  }
})

jake.addListener('complete', function () {
  setImmediate(function () {
    process.exit()
  })
})
