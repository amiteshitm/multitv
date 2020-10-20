import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import { getCategoryPath } from 'shared/software/utils'
import Breadcrumbs from 'components/shared/breadcrumbs'

const BreadcrumbBar = ({ category }) => {
  const path = getCategoryPath(category)

  return <Breadcrumbs path={path} />
}

BreadcrumbBar.fragments = {
  category: gql`
    fragment CategoryBreadcrumbsCategory on Category {
      path {
        name
        slug
      }
    }
  `,
}

BreadcrumbBar.propTypes = {
  category: PropTypes.object.isRequired,
}

export default BreadcrumbBar
