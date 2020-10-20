import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const createMutation = gql`
  mutation CategoryCreate($record: CreateOneCategoryInput!) {
    categoryCreate(record: $record) {
      record {
        name
        desc
      }
    }
  }
`

export function categoryCreateMutation () {
  return graphql(createMutation, {
    props: ({ mutate }) => ({
      categoryCreate: category =>
        mutate({
          variables: { record: category },
        }),
    }),
  })
}
