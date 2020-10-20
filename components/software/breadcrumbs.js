import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import Breadcrumbs from 'components/shared/breadcrumbs'
import { getSoftwarePath } from 'shared/software/utils'

const SoftwareBreadcrumbBar = ({ software }) => {
  const path = getSoftwarePath(software)

  return <Breadcrumbs path={path} />
}

SoftwareBreadcrumbBar.fragments = {
  categories: gql`
    fragment BreadcrumbSoftwareCategories on Software {
      root_category {
        _id
        name
        slug
        path {
          name
          slug
        }
      }
    }
  `,
}

SoftwareBreadcrumbBar.propTypes = {
  software: PropTypes.object.isRequired,
}

export default SoftwareBreadcrumbBar
