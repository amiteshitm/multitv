import { schemaComposer } from 'graphql-compose'

import { AuthenticationError, UserInputError } from 'apollo-server-express'

import { SoftwareTC, SoftwareModel } from 'server/models/software'
import { CategoryTC } from 'server/models/category'
import { UploadTC } from 'server/models/upload'
import { processUpload, processLogo } from 'server/graph/mutations/upload/create'

export function addMongooseMutations () {
  wrapSoftwareResolvers()
  addSoftwareMutations()
  addCategoryMutations()
}

function authenticatedAccess (resolvers) {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve((next) => async (rp) => {
      // extend resolve params with hook
      rp.beforeRecordMutate = async function (doc, rp) {
        const { context } = rp

        if (context.user) {
          if (doc.schema.path('user_id') !== undefined) {
            doc.user_id = context.user._id
          }

          // Validation is required in beforeRecordMutate to catch validation Errors properly.
          try {
            await doc.validate()
          } catch (err) {
            throw new UserInputError(err.message, { invalidArgs: Object.keys(err.errors) })
          }

          return doc
        }

        throw new AuthenticationError('not authenticated')
      }

      return next(rp)
    })
  })
  return resolvers
}

function wrapSoftwareResolvers () {
  SoftwareTC.wrapResolverAs('updateOneWithUpload', 'updateOne', (updateOneWithUpload) => {
    return updateOneWithUpload.wrapResolve((next) => async (rp) => {
      // extend resolve params with hook
      const software = await SoftwareModel.findOne(rp.args.filter)
      if (rp.args.record.uploads) {
        const addUploads = { ...rp.args.record.uploads }
        rp.args.record.uploads.length = 0
        for (let idx in addUploads) {
          const uploadInfo = await processUpload(software._id, addUploads[idx].file)
          rp.args.record.uploads = rp.args.record.uploads.concat(uploadInfo)
        }
      }

      if (rp.args.record.logo) {
        const logoInfo = await processLogo(software._id, rp.args.record.logo)
        rp.args.record.logo = logoInfo
      }

      return next(rp)
    })
  })
}

function addSoftwareMutations () {
  SoftwareTC.getInputTypeComposer().setField('logo', 'UploadedFileInput')

  schemaComposer.Mutation.addFields({
    ...authenticatedAccess({
      softwareCreate: SoftwareTC.getResolver('createOne'),
      softwareUpdateOne: SoftwareTC.getResolver('updateOneWithUpload'),
    }),
  })
}

function addCategoryMutations () {
  schemaComposer.Mutation.addFields({
    ...authenticatedAccess({
      categoryCreate: CategoryTC.getResolver('createOne'),
      categoryUpdateOne: CategoryTC.getResolver('updateOne'),
    }),
  })
}
