import { createTestClient } from 'apollo-server-testing'
import elasticsearch from 'elasticsearch'
import gql from 'graphql-tag'

import { constructTestServer } from 'test/apollo'
import { FactoryBot } from 'test/factories'
import { CategoryModel } from 'server/models/category'

require('test/helper')
require('test/elastic')

jest.mock('elasticsearch')

const CREATE_CATEGORY = gql`
  mutation CategoryCreate($record: CreateOneCategoryInput!) {
    categoryCreate(record: $record) {
      record {
        name
        desc
      }
    }
  }
`

beforeAll(() => {
  elasticsearch.mockImplementation(() => ({
    Client: jest.fn(() => {}),
  }))
})

describe('mutation creates category', () => {
  let server, mutate

  beforeEach(() => {
    server = constructTestServer().server
    mutate = createTestClient(server).mutate
  })

  it('creates parent category', async () => {
    const res = await mutate({
      mutation: CREATE_CATEGORY,
      variables: {
        record: {
          name: 'First Category',
          slug: 'first-category',
          details: 'This is the first category',
          desc: 'This is a category description to test',
        },
      },
    })

    expect(res).toMatchSnapshot()
  })

  it('creates child category', async () => {
    let category = await FactoryBot.create('category')

    const res = await mutate({
      mutation: CREATE_CATEGORY,
      variables: {
        record: {
          name: 'First Category',
          slug: 'first-category',
          details: 'This is the first category',
          desc: 'This is a category description to test',
          parent_id: category.id,
        },
      },
    })

    category = await CategoryModel.findById(category._id)

    expect(category.children).toHaveLength(1)

    expect(res).toMatchSnapshot()
  })
})
