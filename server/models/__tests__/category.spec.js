import { FactoryBot } from 'test/factories'
import { CategoryModel } from 'server/models/category'

require('test/helper')

describe('create category', function () {
  it('creates a category with valid inputs', async function () {
    const feature = await FactoryBot.create('feature')
    const category = await FactoryBot.create('category', {
      features: [feature._id],
    })

    expect(category).not.toBeNull()
  })
})

describe('update category', function () {
  let category

  beforeEach(async function () {
    const feature = await FactoryBot.create('feature')
    const feature2 = await FactoryBot.create('feature', { name: 'Feature 2' })

    category = await FactoryBot.create('category', {
      features: [feature._id, feature2._id],
    })
  })

  it('updates a category with new feature', async function () {
    expect(category.isNew).toBeFalsy()

    const feature3 = await FactoryBot.create('feature', { name: 'Feature 3' })
    await category.updateOne({ $push: { features: feature3._id } }, { new: true })
    category = await CategoryModel.findById(category._id)
    expect(category.features).toEqual(expect.arrayContaining([feature3._id]))
  })

  it('appropriately updates the path in the child', async function () {
    const childCat = await FactoryBot.create('category', {
      name: 'Child Category',
      parent_id: category._id,
    })

    expect(childCat.path.length).toEqual(1)
    expect(childCat.path[0].name).toEqual(category.name)
  })

  it('appropriately updates the children in the parent category', async function () {
    const childCat = await FactoryBot.create('category', {
      name: 'Child Category',
      parent_id: category._id,
    })
    category = await CategoryModel.findById(category._id)

    expect(category.children).toEqual(expect.arrayContaining([childCat._id]))
  })
})
