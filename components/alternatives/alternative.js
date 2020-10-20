import React from 'react'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(3),
  },
}))

export default function Alternative ({ alternativeES }) {
  const classes = useStyles()

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" component="h3">
        This is a sheet of paper.
      </Typography>
      <Typography component="p">Paper can be used to build surface or other elements for your application.</Typography>
    </Paper>
  )
}

Alternative.propTypes = {
  alternativeES: PropTypes.object.isRequired,
}
