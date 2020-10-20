import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const createMutation = gql`
  mutation SoftwareCreate($record: CreateOneSoftwareInput!) {
    softwareCreate(record: $record) {
      record {
        name
        desc
      }
    }
  }
`

export function softwareCreateMutation () {
  return graphql(createMutation, {
    props: ({ mutate }) => ({
      softwareCreate: software =>
        mutate({
          variables: { record: software },
        }),
    }),
  })
}
