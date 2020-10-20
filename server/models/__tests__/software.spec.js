import { FactoryBot } from 'test/factories'

const mongoose = require('mongoose')

require('test/helper')

describe('create software', function () {
  let category, feature

  beforeEach(async () => {
    feature = await FactoryBot.create('feature')
    category = await FactoryBot.create('category', {
      features: [feature._id],
    })
  })

  it('creates a sofware with valid inputs', async function () {
    const software = await FactoryBot.create('software', {
      categories: [category._id],
      root_category_id: category._id,
    })

    expect(software).not.toBeNull()
    expect(software.isNew).toBeFalsy()
  })

  it('raises an error without category fields', async function () {
    await expect(FactoryBot.create('software')).rejects.toThrowError(mongoose.Error.ValidationError)
  })

  it('raises an error without root_category_id', async function () {
    await expect(FactoryBot.create('software', { categories: [category._id] })).rejects.toThrowError(
      mongoose.Error.ValidationError
    )
  })
  it('raises an error with an invalid category', async function () {
    await expect(FactoryBot.create('software', { categories: [feature._id] })).rejects.toThrowError(
      mongoose.Error.ValidationError
    )
  })

  describe('add app links', () => {
    it('raises an error for invalid app type', async () => {
      await expect(
        FactoryBot.create('software', {
          categories: [category._id],
          root_category_id: category._id,
          apps: { test: 'https://abd.com' },
        })
      ).rejects.toThrowError(mongoose.Error.ValidationError)
    })

    it('raises an error for invalid iTunes url', async () => {
      await expect(
        FactoryBot.create('software', {
          categories: [category._id],
          root_category_id: category._id,
          apps: { ios: 'https://abd.com' },
        })
      ).rejects.toThrowError(mongoose.Error.ValidationError)
    })

    it('successfully creates software with valid urls', async () => {
      const software = await FactoryBot.create('software', {
        categories: [category._id],
        root_category_id: category._id,
        apps: { ios: 'https://itunes.apple.com/xxx', android: 'https://play.google.com/store/apps/details?id=xxx' },
      })

      expect(software).not.toBeNull()
      expect(software.apps).toEqual({
        ios: 'https://itunes.apple.com/xxx',
        android: 'https://play.google.com/store/apps/details?id=xxx',
      })
    })
  })
})
