import { SoftwareModel } from 'server/models/software'
// Dont remove unused FeatureModel or the script will fail.
import { FeatureModel } from 'server/models/feature'

const util = require('util')
const mongoose = require('mongoose')

require('dotenv').config()

// To run the tasks first build using: webpack --mode development --config webpack.tasks.config.js
// or yarn run build-tasks in the root directory of project.
// Then run, jake -f dist/main.js esSynchronize.

desc('The task synchronizes the mongoose models to Elastic Search')
task('esSynchronize', { async: true }, async function (params) {
  await mongoose.connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:27017/${
      process.env.DB_NAME
    }?authSource=admin`
  )
  const perPage = 5
  const numDocs = await SoftwareModel.countDocuments({})
  const numPages = Math.ceil(numDocs / perPage)
  let currPage = 1

  SoftwareModel.esCount = util.promisify(SoftwareModel.esCount)
  SoftwareModel.search = util.promisify(SoftwareModel.search)

  while (currPage <= numPages) {
    const softwareRecords = await SoftwareModel.find({})
      .limit(perPage)
      .skip(perPage * (currPage - 1))
      .select('slug')

    const matches = []

    // construct es query
    softwareRecords.map(s => matches.push({ match: { slug: s.slug } }))

    const results = await SoftwareModel.esCount({
      bool: {
        should: matches,
      },
    })

    if (results.count < softwareRecords.length) {
      // Find the records missing in ES.
      const softwaresES = await SoftwareModel.search({
        bool: {
          should: matches,
        },
      })

      const { hits } = softwaresES.hits
      const missingSlugs = []

      softwareRecords.forEach(software => {
        const isAbsent = hits.findIndex(sRecord => software.slug === sRecord._source.slug) === -1

        if (isAbsent) {
          missingSlugs.push(software.slug)
        } else {
          console.log(`Found ${software.name}`)
        }
      })

      console.log('Will Sync')
      console.log(missingSlugs)

      try {
        const st = SoftwareModel.synchronize({ slug: { $in: missingSlugs } })

        await new Promise((resolve, reject) => {
          st.on('close', () => resolve())
          st.on('error', reject(console.error))
        })
      } catch (err) {
        console.log('Error in Catch')
        console.log(err)
      }
    }

    currPage++
    await sleep(5000)
  }

  this.complete()
})

function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

jake.addListener('complete', function () {
  setImmediate(function () {
    process.exit()
  })
})
