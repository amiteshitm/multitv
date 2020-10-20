import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const updateMutation = gql`
  mutation CategoryUpdate($record: UpdateOneCategoryInput!, $filter: FilterUpdateOneCategoryInput) {
    categoryUpdateOne(record: $record, filter: $filter) {
      record {
        name
        desc
        details
      }
    }
  }
`

export function categoryUpdateMutation () {
  return graphql(updateMutation, {
    props: ({ mutate }) => ({
      categoryUpdate: category =>
        mutate({
          variables: { record: category, filter: { slug: category.slug } },
        }),
    }),
  })
}
