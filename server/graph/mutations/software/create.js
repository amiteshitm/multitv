import { UserInputError, ApolloError } from 'apollo-server-express'
import mongoose from 'mongoose'

import { SoftwareModel } from 'server/models/software'

/* const softwareCreate = {
  type: SoftwareType,
  args: {
    input: {
      type: new GraphQLNonNull(SoftwareInput),
    },
  },
  resolve (root, params) {
    const sModel = new SoftwareModel(params.input)

    const newSoftware = sModel.save()
    if (!newSoftware) {
      throw new Error('Error')
    }
    return newSoftware
  },
} */

const softwareCreate = async (obj, params) => {
  const sModel = new SoftwareModel(params.input)
  let newSoftware

  try {
    newSoftware = await sModel.save()
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      throw new UserInputError(err.message, { invalidArgs: Object.keys(err.errors) })
    }

    throw new ApolloError(err.message)
  }
  return newSoftware
}

export default softwareCreate
