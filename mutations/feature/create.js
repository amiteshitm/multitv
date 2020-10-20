import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const createMutation = gql`
  mutation FeatureCreate($input: FeatureInput!) {
    featureCreate(input: $input) {
      name
      parent {
        id
        name
      }
    }
  }
`

export function featureCreateMutation () {
  return graphql(createMutation, {
    props: ({ mutate }) => ({
      featureCreate: (feature) => mutate({
        variables: { input: feature },
      }),
    }),
  })
}
