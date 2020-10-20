import React from 'react'
import PropTypes from 'prop-types'

import Link from 'next/link'
import capitalize from 'lodash/capitalize'

import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  chipMargin: {
    margin: theme.spacing(1, 1, 1, 0),
  },
}))

export default function Tags ({ software }) {
  const classes = useStyles()
  const { tags } = software

  return (
    <>
      {tags.map((tag, index) => {
        const url = `/tagged/${encodeURIComponent(tag.toLowerCase())}`
        return (
          <Link key={index} href={url} as={url}>
            <a>
              <Chip color="secondary" label={capitalize(tag)} className={classes.chipMargin} clickable={true} />
            </a>
          </Link>
        )
      })}
    </>
  )
}

Tags.propTypes = {
  software: PropTypes.object.isRequired,
}
