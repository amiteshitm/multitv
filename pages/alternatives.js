import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { useQuery } from '@apollo/react-hooks'

import ApplicationLayout from 'layouts/application'
import SoftwareHero from 'components/software/hero'
import Breadcrumbs from 'components/alternatives/breadcrumbs'
import PageHeader from 'components/alternatives/header'
import AlternativesList from 'components/alternatives/list'
import withApollo from 'util/apollo'

const pageDesc = software =>
  `List of best alternatives, competitors, tools & products related to ${
    software.name
  }`

const buildAlternativesQuery = ({ softwareData }) => {
  if (softwareData === undefined) {
    return {}
  }

  const {
    softwareOne,
    softwareOne: { categories, root_category: rootCategory }
  } = softwareData

  const rootCategoryMatch = {
    match: {
      root_category_id: { query: rootCategory._id }
    }
  }
  const matches = [rootCategoryMatch]

  categories.forEach(c =>
    matches.push({ match: { categories___id: { query: c } } })
  )

  const functions = [{ filter: rootCategoryMatch, weight: 1.1 }]
  const selfFilter = { match: { slug: { query: softwareOne.slug } } }

  const query = {
    function_score: {
      query: {
        bool: {
          should: matches,
          must_not: selfFilter
        }
      },
      functions
    }
  }

  return query
}

function Alternatives() {
  const router = useRouter()

  const { data: softwareData, loading: softwareLoading } = useQuery(
    GET_SOFTWARE,
    {
      variables: { filter: { slug: router.query.slug } }
    }
  )

  const { data: alternativesData, loading: alternativesLoading } = useQuery(
    SEARCH_SOFTWARE,
    {
      skip: softwareLoading === true || softwareData === undefined,
      variables: {
        query: buildAlternativesQuery({ softwareData }),
        sort: ['_score', 'created_at__asc']
      }
    }
  )

  if (
    !softwareData ||
    !alternativesData ||
    softwareLoading ||
    alternativesLoading
  ) {
    return 'Loading ...'
  }

  const { softwareOne: software } = softwareData
  const { alternativesES } = alternativesData

  return (
    <ApplicationLayout>
      <Head>
        <title>
          Alternatives & Competitors to {software.name} -{' '}
          {new Date().getFullYear()}
        </title>
        <meta
          name="description"
          content={pageDesc(software)}
          key="description"
        />
      </Head>
      <Breadcrumbs software={software} />
      <PageHeader software={software} />
      <AlternativesList alternativesES={alternativesES} />
    </ApplicationLayout>
  )
}

Alternatives.propTypes = {
  softwareData: PropTypes.object,
  alternativesData: PropTypes.object
}

Alternatives.fragments = {
  software: gql`
    fragment AlternativesPageSoftware on Software {
      _id
      name
      slug
      desc
      details
      website
      categories
      upload(aspect: "proof") {
        name
        filepath
      }
    }
  `
}

const GET_SOFTWARE = gql`
  query GetSoftware(
    $filter: FilterFindOneSoftwareInput
    $skip: Int
    $sort: SortFindOneSoftwareInput
  ) {
    softwareOne(filter: $filter, skip: $skip, sort: $sort) {
      ...AlternativesPageSoftware
      ...SoftwareLogoHero
      ...BreadcrumbSoftwareCategories
    }
  }
  ${Alternatives.fragments.software}
  ${SoftwareHero.fragments.logo}
  ${Breadcrumbs.fragments.categories}
`

const SEARCH_SOFTWARE = gql`
  query SearchSoftware($query: SoftwareESQuery!, $sort: [SoftwareESSortEnum!]) {
    alternativesES: softwareConnection(query: $query, sort: $sort) {
      edges {
        node {
          _score
          _source {
            name
            slug
            desc
            created_at
            categories {
              _id
              name
            }
            uploads {
              filepath
              aspect
            }
            logo {
              filepath
              aspect
            }
          }
        }
      }
    }
  }
`

export default compose(withApollo)(Alternatives)
