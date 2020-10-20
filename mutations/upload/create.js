import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const uploadMutationQuery = gql`
  mutation uploadFile($file: Upload!) {
    uploadCreate(input: $file) {
      status
    }
  }
`

export function uploadFileMutation () {
  return graphql(uploadMutationQuery, {
    props: ({ mutate }) => ({
      uploadFile: (file) => {
        console.log(`value of file is ${file}`)
        return mutate({
          variables: { file },
        })
      },
    }),
  })
}
