import React from 'react'

import classNames from 'classnames'

import { withStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'

import globalStyles from 'shared/styles'

const styles = (theme) => ({
  heroUnit: {
    background: 'linear-gradient(to top, #8E54E9, #4776E6)',
    color: theme.palette.common.white,
  },
  heroContent: {
    padding: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 4}px`,
    color: '#fff',
  },
  layout: globalStyles(theme).layout,
  heroButtons: {
    marginTop: theme.spacing(4),
  },
})

const Hero = ({ classes }) => (
  <div className={classes.heroUnit}>
    <div className={classNames(classes.layout, classes.heroContent)}>
      <Typography component="h1" variant="h4" align="center" color="inherit" gutterBottom>
        Best Software & Apps for You
      </Typography>
      <Typography variant="h6" align="center" color="inherit" paragraph>
        Find the Right Software & Apps for Your Business & Personal use.
      </Typography>
    </div>
  </div>
)

export default withStyles(styles)(Hero)
