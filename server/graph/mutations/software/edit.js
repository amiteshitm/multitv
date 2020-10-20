import { SoftwareModel } from 'server/models/software'
import { processUpload, processLogo } from 'server/graph/mutations/upload/create'

const softwareUpdate = async (obj, params) => {
  const { media, logo, features, ...vars } = params.input
  let update = { $set: vars }

  if (features && features.length > 0) {
    await SoftwareModel.update({ slug: params.input.slug }, { $set: { features: [] } })

    update['$addToSet'] = { features }
  }

  return SoftwareModel.findOneAndUpdate({ slug: params.input.slug }, update, { new: true }).then(newSoftware => {
    if (media) {
      return processUpload(newSoftware, params.input.media)
        .catch(error => {
          console.log('Got the Error while uploading media')
          console.log(error)
        })
        .then(u => {
          return u
        })
    }
    if (logo) {
      return processLogo(newSoftware, params.input.logo).catch(error => {
        console.log('Got the Error while uploading logo')
        console.log(error)
      })
    }
    return newSoftware
  })
}

export default softwareUpdate
