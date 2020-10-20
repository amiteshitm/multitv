const { Client } = require('elasticsearch')
const mapping = require('../../shared/elastic/mapping').default

const client = new Client({ node: `${process.env.ELASTIC_HOST}` })

// To run the tasks first build using: webpack --mode development --config webpack.tasks.config.js
// or yarn run build-tasks in the root directory of project.
// Then run, jake -f dist/main.js esPutMapping.

desc('The task updates the mapping with the latest mapping')
task('esPutMapping', { async: true }, async function (params) {
  const result = await client.indices.putMapping({
    index: process.env.ELASTIC_INDEX_ALIAS,
    type: 'software',
    include_type_name: true,
    body: mapping,
  })

  console.log(result)

  this.complete()
})

jake.addListener('complete', function () {
  setImmediate(function () {
    process.exit()
  })
})
