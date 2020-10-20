const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const featureEmbedSchema = new Schema({
  feature: { type: 'ObjectId', required: true, ref: 'Feature' },
  data: { type: Schema.Types.Mixed },
})

featureEmbedSchema.plugin(uniqueValidator)

const FeatureEmbedModel = mongoose.model('FeatureEmbed', featureEmbedSchema)

export { FeatureEmbedModel, featureEmbedSchema }
