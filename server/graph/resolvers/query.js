import { SoftwareModel } from 'server/models/software'
import { FeatureModel } from 'server/models/feature'

const QueryType = {
  Query: {
    features: (obj, args, ctx, info) => {
      let conditions = {}

      if (args.filter) {
        const { parent_id: parentId } = args.filter

        conditions['parent_id'] = { $in: parentId }
      }

      const features = FeatureModel.find(conditions)
        .sort({ created_at: -1 })
        .exec()
      if (!features) {
        throw new Error('Error')
      }
      return features
    },

    tags: async (obj, args, ctx, info) => {
      const matchRegEx = new RegExp(args.contains, 'i')

      const tags = await SoftwareModel.aggregate([
        { $unwind: '$tags' },
        { $match: { tags: { $regex: matchRegEx } } },
        { $group: { _id: '$tags', number: { $sum: 1 } } },
        { $sort: { number: -1 } },
      ])

      return tags
    },
  },
}

export default QueryType
