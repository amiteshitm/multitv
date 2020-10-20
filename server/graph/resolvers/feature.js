import { FeatureModel } from 'server/models/feature'

const FeatureType = {
  Query: {
    feature: (_obj, args, _ctx, _info) => {
      return FeatureModel.findById(args.id)
    },
  },
  Feature: {
    parent: (obj, _args, _ctx, _info) => (obj.parent_id ? FeatureModel.findById(obj.parent_id).exec() : null),
  },
}

export default FeatureType
