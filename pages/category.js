import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { compose } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'

import { useRouter } from 'next/router'
import Head from 'next/head'

import ApplicationLayout from 'layouts/application'
import CategoryHero from 'components/category/hero'
import Breadcrumbs from 'components/category/breadcrumbs'
import SoftwareList from 'shared/software-list'
import { buildFilteredQuery } from 'shared/elastic/queries/filtered'
import { withApollo } from 'util/apollo'

const pricingTitle = (pricing) => {
  switch (pricing) {
    case 'free':
      return 'Free'
    case 'open-source':
      return 'Open Source'
  }
}

const title = ({ categoryData, router }) => {
  const { categoryOne: category } = categoryData
  const { query } = router

  if (query.pricing) {
    return `Best ${pricingTitle(query.pricing)} ${category.name} Software & Tools ${new Date().getFullYear()}`
  } else {
    return `Best ${category.name} Software & Tools ${new Date().getFullYear()}`
  }
}

const description = ({ categoryData }) => {
  const { categoryOne: category } = categoryData

  return `Compare & Find Best ${category.name} Software & Tools ${new Date().getFullYear()}`
}

const getCategoryESQuery = ({ categoryData, router }) => {
  if (!categoryData) {
    return {}
  }

  const { categoryOne: category } = categoryData
  const { children: categories } = category
  const query = buildFilteredQuery({
    rootCategory: category,
    categories,
    pricing: router.query.pricing,
  })

  return query
}

const CategoryPage = () => {
  const router = useRouter()

  const { data: categoryData, loading: categoryLoading } = useQuery(GET_CATEGORY, {
    variables: { filter: { slug: router.query.slug } },
  })

  const { data: categoryFiltered, loading: filteredLoading } = useQuery(FILTERED_SOFTWARE, {
    skip: !categoryData || categoryLoading,
    variables: { query: getCategoryESQuery({ categoryData, router }), sort: ['_score', 'created_at__asc'] },
  })

  if (!categoryData || categoryLoading || !categoryFiltered || filteredLoading) {
    return <div>Loading...</div>
  }

  const { categoryOne: category } = categoryData
  const { filteredES } = categoryFiltered

  return (
    <ApplicationLayout>
      <Head>
        <title>{title({ categoryData, router })}</title>
        <meta name="description" content={description({ categoryData })} key="description" />
      </Head>
      <Breadcrumbs category={category} />
      <CategoryHero category={category} />
      <SoftwareList softwares={filteredES} />
    </ApplicationLayout>
  )
}

CategoryPage.propTypes = {
  data: PropTypes.object,
  categoryData: PropTypes.object,
  router: PropTypes.object,
}

const GET_CATEGORY = gql`
  query GetCategory($filter: FilterFindOneCategoryInput, $skip: Int, $sort: SortFindOneCategoryInput) {
    categoryOne(filter: $filter, skip: $skip, sort: $sort) {
      _id
      name
      slug
      desc
      children {
        _id
      }
      ...CategoryBreadcrumbsCategory
    }
  }
  ${Breadcrumbs.fragments.category}
`

const FILTERED_SOFTWARE = gql`
  query GetTaggedSoftware($query: SoftwareESQuery!, $sort: [SoftwareESSortEnum!]) {
    filteredES: softwareConnection(query: $query, sort: $sort) {
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

export default compose(withApollo)(CategoryPage)
