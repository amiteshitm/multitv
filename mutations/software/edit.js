import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const updateMutation = gql`
  mutation softwareUpdateOne($record: UpdateOneSoftwareInput!, $filter: FilterUpdateOneSoftwareInput) {
    softwareUpdateOne(record: $record, filter: $filter) {
      _id: recordId
      record {
        name
        desc
        details
        upload(aspect: "proof") {
          id
          name
          alt
          filepath
        }
      }
    }
  }
`

export function softwareUpdateMutation () {
  return graphql(updateMutation, {
    props: ({ mutate }) => ({
      softwareUpdate: software =>
        mutate({
          variables: { record: software, filter: { slug: software.slug } },
        }),
    }),
  })
}
