import { addSoftwareResolvers } from './software'
import { addCategoryResolvers } from './category'

import { UploadTC } from 'server/models/upload'
import { SoftwareTC } from 'server/models/software'

export function addMongooseResolvers () {
  modifyUploadInputFields()
  addSoftwareResolvers()
  addCategoryResolvers()
  SoftwareTC.getResolver('updateOne')
    .getArgTC('record')
    .addFields({ logo: { type: 'Upload' } })
}

function modifyUploadInputFields () {
  // Add a media field for the file to be uploaded.
  const uploadITC = UploadTC.getInputTypeComposer()

  uploadITC.addFields({
    file: { type: 'Upload!' },
  })

  uploadITC.makeFieldNullable('name')
}
