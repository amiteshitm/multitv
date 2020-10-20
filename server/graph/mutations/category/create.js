import { CategoryModel } from 'server/models/category'

const categoryCreate = async (obj, params) => {
  const category = new CategoryModel(params.input)

  const newCategory = await category.save()
  if (!newCategory) {
    throw new Error('Error')
  }
  return newCategory
}

export default categoryCreate
