import { composeWithMongoose } from 'graphql-compose-mongoose'
import mongoosastic from 'mongoosastic'

import isEmpty from 'lodash/isEmpty'

import { uploadSchema } from 'server/models/upload'
import { CategoryModel, CategorySchema } from 'server/models/category'
import { featureEmbedSchema } from 'server/models/feature_embed'
import esClient from 'server/lib/es_client'
import { validateAppType, validateAppUrls } from './validators/software'

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

require('dotenv').config()

const { Schema } = mongoose

const { Mixed, ObjectId } = Schema.Types

const videoSchema = new Schema({
  title: { type: String, required: true },
  embed_code: { type: String, required: true }
})

const Software = new Schema(
  {
    name: { type: 'String', required: true },
    // slug: { type: 'String', required: true, unique: true },
    slug: { type: 'String' },

    twitter: { type: 'String' },
    // website: { type: 'String', required: true },
    website: { type: 'String' },
    github: { type: 'String' },
    reddit: { type: 'String' },
    medium: { type: 'String' },

    details: { type: 'String' },
    // desc: { type: 'String', required: true, minlength: 50, maxLength: 300 },
    desc: { type: 'String', required: true },
    is_published: { type: 'Boolean', default: true },

    categories: {
      type: [ObjectId],
      es_schema: CategorySchema,
      validate: [
        {
          validator: v => v !== null && v !== undefined && v.length > 0,
          message: 'Categories is a required field'
        },
        {
          validator: v => {
            const promises = v.map(cat =>
              CategoryModel.findById(cat).orFail(
                () => new Error('Category not found')
              )
            )

            return new Promise((resolve, reject) =>
              Promise.all(promises)
                .then(() => resolve(true))
                .catch(err => reject(err))
            )
          },
          message: 'Invalid Category List'
        }
      ]
    },
    root_category_id: { type: ObjectId, required: true, ref: 'Category' },
    videos: [videoSchema],
    uploads: [uploadSchema],
    logo: [uploadSchema],
    features: [featureEmbedSchema],
    tags: { type: [String] },
    pricing: { type: String, enum: ['free', 'paid', 'freemium', 'open'] },
    apps: {
      type: Mixed,
      validate: [
        {
          validator: v => isEmpty(v) || validateAppType(v),
          message: 'Invalid App type value'
        },
        {
          validator: v => validateAppUrls(v),
          message: 'One of the App urls is invalid'
        }
      ]
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

Software.plugin(uniqueValidator)

Software.plugin(mongoosastic, {
  populate: [
    { path: 'categories', model: 'Category' },
    { path: 'features.feature', model: 'Feature' }
  ],
  index:
    process.env.NODE_ENV === 'test'
      ? 'softwares_test'
      : process.env.ELASTIC_INDEX_ALIAS,
  esClient
})

Software.pre('save', function(next) {
  if (!isEmpty(this.tags)) {
    const newTags = this.tags.map(tag => tag.toLowerCase())

    this.tags = newTags
  }
  next()
})

const SoftwareModel = mongoose.model('Software', Software)

const SoftwareTC = composeWithMongoose(SoftwareModel, {
  fields: {
    remove: ['created_at', 'updated_at']
  }
})

export { SoftwareModel, SoftwareTC }
