import { convertSchemaToGraphQL } from 'graphql-compose-mongoose'
import { schemaComposer } from 'graphql-compose'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const uploadSchema = new Schema(
  {
    name: { type: 'String', required: true },
    mimetype: { type: 'String' },
    size: { type: 'Number' },
    filepath: { type: 'String' },
    details: { type: 'String' },
    alt: { type: 'String' },
    aspect: { type: 'String' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

uploadSchema.plugin(uniqueValidator)

const UploadModel = mongoose.model('Upload', uploadSchema)

const UploadTC = convertSchemaToGraphQL(uploadSchema, 'UploadedFile', schemaComposer)

export { UploadModel, uploadSchema, UploadTC }
