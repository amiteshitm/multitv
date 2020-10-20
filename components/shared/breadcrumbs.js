import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Link from 'next/link'

import { makeStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Paper from '@material-ui/core/Paper'
import grey from '@material-ui/core/colors/grey'

import globalStyle from 'shared/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    background: grey[100],
  },
  homeIcon: {
    marginRight: theme.spacing(1),
  },
  bcSeparator: {
    padding: `0 ${theme.spacing(1)}px 0`,
  },
  li: {
    display: 'flex',
  },
  layout: globalStyle(theme).layout,
}))

const BreadcrumbBar = ({ path }) => {
  const classes = useStyles()

  const breadcrumbs = path.map((p, idx) => {
    const lastIndex = idx === path.length - 1

    if (p.href === '/') {
      return (
        <Fragment key={idx}>
          <Icon className={classes.homeIcon}>home</Icon>
          <Link href="/" as="/">
            <a>Home</a>
          </Link>
        </Fragment>
      )
    } else {
      return (
        <Fragment key={idx}>
          {!lastIndex && (
            <Link href={p.href} as={p.as}>
              <a>{p.name}</a>
            </Link>
          )}
          {lastIndex && <span>{p.name}</span>}
        </Fragment>
      )
    }
  })

  return (
    <Paper elevation={0} className={classnames(classes.root, classes.layout)}>
      <Breadcrumbs classes={{ li: classes.li }} aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Paper>
  )
}

BreadcrumbBar.propTypes = {
  path: PropTypes.array.isRequired,
}

export default BreadcrumbBar
