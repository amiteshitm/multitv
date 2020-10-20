import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { compose } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'

import ApplicationLayout from 'layouts/application'
import Hero from 'components/home/hero'
import SoftwareList from 'components/home/list'
import withApollo from 'util/apollo'

const HomePage = () => {
  const { loading, data } = useQuery(GET_SOFTWARES, {
    variables: { sort: 'UPDATED_AT_DESC' }
  })
  if (loading) {
    return '<div>Loading..</div>'
  }

  const { softwareMany: softwares } = data

  return (
    <ApplicationLayout>
      <Hero />
      {softwares && <SoftwareList softwares={softwares} />}
    </ApplicationLayout>
  )
}

HomePage.propTypes = {
  data: PropTypes.object.isRequired
}

const GET_SOFTWARES = gql`
  query GetSoftwares(
    $filter: FilterFindManySoftwareInput
    $skip: Int
    $sort: SortFindManySoftwareInput
  ) {
    softwareMany(filter: $filter, skip: $skip, sort: $sort) {
      ...SoftwareListSoftwares
    }
  }
  ${SoftwareList.fragments.softwares}
`

export default compose(withApollo)(HomePage)
