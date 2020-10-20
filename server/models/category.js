import { composeWithMongoose } from 'graphql-compose-mongoose'

import { uploadSchema } from 'server/models/upload'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const CategorySchema = new Schema(
  {
    name: { type: 'String', required: true },
    slug: { type: 'String', required: true, unique: true },

    details: { type: 'String' },
    desc: { type: 'String', required: true },
    is_published: { type: 'Boolean', default: true },

    cover: [uploadSchema],
    logo: [uploadSchema],
    children: [Schema.Types.ObjectId],
    path: [
      {
        name: Schema.Types.String,
        slug: Schema.Types.String,
        category_id: Schema.Types.ObjectId,
      },
    ],
    parent_id: { type: 'ObjectId', default: null },
    features: [{ type: Schema.Types.ObjectId, ref: 'Feature' }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

CategorySchema.pre('save', async function (next) {
  if (this.parent_id != null) {
    const parent = await CategoryModel.findById(this.parent_id)
    const pathElem = {
      name: parent.name,
      slug: parent.slug,
      category_id: parent._id,
    }
    let path = parent.path
    path.push(pathElem)

    this.path = path
  }
  next()
})

CategorySchema.post('save', async doc => {
  // update the parent
  await CategoryModel.findByIdAndUpdate(doc.parent_id, { $push: { children: doc._id } })
})

CategorySchema.plugin(uniqueValidator)

const CategoryModel = mongoose.model('Category', CategorySchema)

const CategoryTC = composeWithMongoose(CategoryModel, {
  fields: {
    remove: ['created_at', 'updated_at'],
  },
})

export { CategoryModel, CategorySchema, CategoryTC }
