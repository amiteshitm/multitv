import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    margin: '16px auto',
    justifyContent: 'center',
    textAlign: 'center',
    borderBottom: '1px solid #ccc',
    width: 'auto',
  },
}))

const PageHeader = ({ title, subTitle }) => {
  const classes = useStyles()

  return (
    <Grid className={classes.container} container>
      <Grid item>
        <Typography gutterBottom component="h1" variant="h4">
          {title}
        </Typography>
        <Typography gutterBottom>{subTitle}</Typography>
      </Grid>
    </Grid>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
}

export default PageHeader
