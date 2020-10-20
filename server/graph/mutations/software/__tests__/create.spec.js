import { createTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'

import { constructTestServer } from 'test/apollo'
import { FactoryBot } from 'test/factories'

import { delay } from 'shared/util'

require('test/helper')
require('test/elastic')

const CREATE_SOFTWARE = gql`
  mutation SoftwareCreate($record: CreateOneSoftwareInput!) {
    softwareCreate(record: $record) {
      record {
        name
        slug
        details
        desc
        categories
        root_category {
          name
        }
      }
    }
  }
`

describe('mutation creates category', () => {
  let server, mutate, feature, category

  beforeEach(async () => {
    server = constructTestServer().server
    mutate = createTestClient(server).mutate

    feature = await FactoryBot.create('feature')
    category = await FactoryBot.create('category', {
      features: [feature._id],
    })
  })

  it('raises appropriate errors with invalid inputs', async () => {
    const res = await mutate({
      mutation: CREATE_SOFTWARE,
      variables: {
        record: {
          name: 'Test Software Invalid',
          slug: 'test-software',
          details: 'This is the first software',
          desc: 'This is a software description to test',
          root_category_id: category._id,
        },
      },
    })
    expect(res.errors).toHaveLength(1)
    expect(res.errors[0].name).toEqual('GraphQLError')
    expect(res.errors[0].extensions.code).toEqual('BAD_USER_INPUT')
  })

  describe('software creation', () => {
    beforeEach(async () => {
      jest.setTimeout(10000)
    })

    it('creates software with valid inputs', async () => {
      const res = await mutate({
        mutation: CREATE_SOFTWARE,
        variables: {
          record: {
            name: 'Test Software',
            slug: 'test-software',
            details: 'This is the first software',
            desc: 'This is a software description to test',
            root_category_id: category._id.toString(),
            categories: [category._id.toString()],
          },
        },
      })
      await delay(1000)
      expect(res.errors).toBeUndefined()
      expect(res.data.softwareCreate).toMatchSnapshot({
        record: {
          categories: [expect.any(String)],
          root_category: {
            name: expect.any(String),
          },
        },
      })
    })
  })
})
