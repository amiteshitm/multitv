import { FeatureModel } from 'server/models/feature'

const featureCreate = (obj, params) => {
  const featureModel = new FeatureModel(params.input)
  const featureObj = featureModel.save()

  return featureObj
}

export default featureCreate
