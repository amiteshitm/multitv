import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import classnames from 'classnames'
import { useQuery } from '@apollo/react-hooks'
import isEmpty from 'lodash/isEmpty'

import Head from 'next/head'
import { useRouter } from 'next/router'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'

import ApplicationLayout from 'layouts/application'
import SoftwareHero from 'components/software/hero'
import SoftwareDetails from 'components/software/description'
import SoftwareRelated from 'components/software/tiles/related'
import SoftwareInfo from 'components/software/tiles/info'
import Breadcrumbs from 'components/software/breadcrumbs'
import Features from 'components/software/features'
import Tags from 'components/software/tags'
import globalStyle from 'shared/styles'
import { withApollo } from 'util/apollo'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(0, 0, 3),
  },
  layout: globalStyle(theme).layout,
  mainGrid: {
    justifyContent: 'space-between',
  },
}))

const getRelatedESQuery = ({ softwareData }) => {
  if (!softwareData) {
    return {}
  }

  const {
    softwareOne: software,
    softwareOne: { categories, root_category: rootCategory },
  } = softwareData

  const rootCategoryMatch = {
    match: {
      root_category_id: { query: rootCategory._id },
    },
  }
  const matches = [rootCategoryMatch]

  categories.forEach((c) => matches.push({ match: { categories___id: { query: c } } }))

  const functions = [{ filter: rootCategoryMatch, weight: 1.1 }]
  const selfFilter = { match: { slug: { query: software.slug } } }

  const query = {
    function_score: {
      query: {
        bool: {
          should: matches,
          must_not: selfFilter,
        },
      },
      functions,
    },
  }

  return query
}

function SoftwarePage (props) {
  const classes = useStyles()
  const router = useRouter()
  const { loading, data: softwareData } = useQuery(GET_SOFTWARE, {
    variables: { filter: { slug: router.query.slug } },
  })

  const { data: related, loading: relatedLoading } = useQuery(RELATED_SOFTWARE, {
    skip: !softwareData || isEmpty(softwareData) || loading === true,
    variables: {
      query: getRelatedESQuery({ softwareData }),
      sort: ['_score', 'created_at__asc'],
    },
  })

  if (loading || relatedLoading) {
    return <div>Loading...</div>
  }

  const { softwareOne: software } = softwareData
  const { relatedES } = related

  const description = `Get ${software.name} Reviews, Alternatives, Competitors, Pricing. Know all the features
    and usability of ${software.name}`

  return (
    <ApplicationLayout>
      <Head>
        <title>
          {software.name} Reviews & Comparison of Alternatives - {new Date().getFullYear()}
        </title>
        <meta name="description" content={description} key="description" />
      </Head>
      <Breadcrumbs software={software} />
      <Grid container className={classnames(classes.layout, classes.mainGrid)} spacing={6}>
        <Grid item sm={12} md={8}>
          <Paper elevation={1} className={classes.paper}>
            <SoftwareHero software={software} />
            <SoftwareDetails software={software} />
            <Tags software={software} />
          </Paper>
          <Features software={software} />
        </Grid>
        <Grid item sm={12} md={4}>
          <SoftwareInfo software={software} />
          <SoftwareRelated software={software} relatedES={relatedES} />
        </Grid>
      </Grid>
    </ApplicationLayout>
  )
}

SoftwarePage.propTypes = {
  data: PropTypes.object,
}

SoftwarePage.fragments = {
  software: gql`
    fragment SoftwarePageSoftware on Software {
      _id
      name
      slug
      desc
      categories
      details
      website
      twitter
      reddit
      medium
      tags
      apps
      features {
        feature {
          name
          parent {
            id
            name
          }
          data_type
        }
        data
      }
      upload(aspect: "proof") {
        name
        filepath
      }
    }
  `,
}

const GET_SOFTWARE = gql`
  query GetSoftware($filter: FilterFindOneSoftwareInput, $skip: Int, $sort: SortFindOneSoftwareInput) {
    softwareOne(filter: $filter, skip: $skip, sort: $sort) {
      ...SoftwarePageSoftware
      ...SoftwareLogoHero
      ...BreadcrumbSoftwareCategories
    }
  }
  ${SoftwarePage.fragments.software}
  ${SoftwareHero.fragments.logo}
  ${Breadcrumbs.fragments.categories}
`

const RELATED_SOFTWARE = gql`
  query SearchSoftware($query: SoftwareESQuery!, $sort: [SoftwareESSortEnum!]) {
    relatedES: softwareConnection(query: $query, sort: $sort) {
      edges {
        node {
          _score
          _source {
            name
            slug
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

export default withApollo(SoftwarePage)
