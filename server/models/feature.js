const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const featureSchema = new Schema({
  name: { type: 'String', required: true },
  slug: { type: 'String', unique: true },
  data_type: { type: 'String', enum: ['String', 'Boolean'] },
  parent_id: { type: 'ObjectId' },
})

featureSchema.pre('save', function (next) {
  this.slug = this.name.replace(/[^A-Za-z0-9]/, '').toLowerCase()

  next()
})

featureSchema.plugin(uniqueValidator)

const FeatureModel = mongoose.model('Feature', featureSchema)

export { FeatureModel, featureSchema }
