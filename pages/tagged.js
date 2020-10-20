import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { compose } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'

import { withRouter } from 'next/router'
import Head from 'next/head'

import ApplicationLayout from 'layouts/application'
import TaggedHero from 'components/tagged/hero'
import Breadcrumbs from 'components/tagged/breadcrumbs'
import SoftwareList from 'shared/software-list'
import { buildFilteredQuery } from 'shared/elastic/queries/filtered'
import { capitalizeText } from 'shared/util'
import { withApollo } from 'util/apollo'

const title = props => {
  const {
    router: { query },
  } = props

  return `Best Software, Tools & Apps tagged ${capitalizeText(query.tag)} ${new Date().getFullYear()}`
}

const description = props => {
  const {
    router: { query },
  } = props

  return `Compare & Find Best ${capitalizeText(query.tag)} Software & Tools ${new Date().getFullYear()}`
}

function TaggedPage (props) {
  const { tag } = props.router.query
  const query = buildFilteredQuery({ tag })
  const { loading, data } = useQuery(TAGGED_SOFTWARE, {
    variables: { query, sort: ['_score', 'created_at__asc'] },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ApplicationLayout>
      <Head>
        <title>{title(props)}</title>
        <meta name="description" content={description(props)} key="description" />
      </Head>
      <Breadcrumbs tag={tag} />
      <TaggedHero tag={tag} />
      <SoftwareList softwares={data.taggedES} />
    </ApplicationLayout>
  )
}

TaggedPage.propTypes = {
  data: PropTypes.object,
  categoryData: PropTypes.object,
  router: PropTypes.object,
}

const TAGGED_SOFTWARE = gql`
  query GetTaggedSoftware($query: SoftwareESQuery!, $sort: [SoftwareESSortEnum!]) {
    taggedES: softwareConnection(query: $query, sort: $sort) {
      edges {
        node {
          _score
          _source {
            name
            slug
            tags
            desc
            uploads {
              name
              filepath
              aspect
            }
            categories {
              _id
              name
            }
          }
        }
      }
    }
  }
`

export default compose(
  withRouter,
  withApollo
)(TaggedPage)
