import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import globalStyles from 'shared/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: '16px auto',
    width: '100%',
    borderBottom: '1px solid #ccc',
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
  },
  layout: globalStyles(theme).layout,
}))

const Hero = ({ name, header }) => {
  const classes = useStyles()

  return (
    <div className={classNames(classes.root, classes.layout)}>
      <div className={classes.paper}>
        <Grid container spacing={16}>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={16}>
              <Grid item xs>
                <Typography gutterBottom component="h1" variant="h4">
                  {name}
                </Typography>
                <Typography component="h2" variant="h6" gutterBottom>
                  {header}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

Hero.propTypes = {
  name: PropTypes.string.isRequired,
  header: PropTypes.string,
}

export default Hero
