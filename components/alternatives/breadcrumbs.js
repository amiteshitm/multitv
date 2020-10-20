import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import classNames from 'classnames'

import { withStyles } from '@material-ui/styles'

import globalStyle from 'shared/styles'
import Breadcrumbs from 'components/shared/breadcrumbs'
import { getAlternativesPath } from 'shared/software/utils'

const styles = theme => ({
  breadcrumbBar: {
    width: '100%',
    padding: theme.spacing(1.5),
    borderBottom: '1px solid #ccc',
  },
  bcContent: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  layout: globalStyle(theme).layout,
})

const AlternativesBreadcrumbBar = ({ classes, software }) => {
  const path = getAlternativesPath(software)

  return (
    <div className={classes.breadcrumbBar}>
      <div className={classNames(classes.layout, classes.bcContent)}>
        <Breadcrumbs path={path} />
      </div>
    </div>
  )
}

AlternativesBreadcrumbBar.fragments = {
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

AlternativesBreadcrumbBar.propTypes = {
  classes: PropTypes.object,
  software: PropTypes.object.isRequired,
}

export default withStyles(styles)(AlternativesBreadcrumbBar)
