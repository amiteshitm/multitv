import { CategoryModel } from 'server/models/category'

const categoryUpdate = (obj, params) => {
  const { media, logo, ...vars } = params.input

  return CategoryModel.findOneAndUpdate({ slug: params.input.slug }, vars, { new: true }).then(cat => cat)
}

export default categoryUpdate
