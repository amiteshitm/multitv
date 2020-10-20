import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/styles'

import globalStyles from 'shared/styles'

const styles = theme => ({
  layout: globalStyles(theme).layout,
  root: {
    marginBottom: `${theme.spacing(2)}px`,
  },
})

const Description = ({ software, classes }) => (
  <div className={classes.root} dangerouslySetInnerHTML={{ __html: software.details }} />
)

Description.propTypes = {
  software: PropTypes.object.isRequired,
  classes: PropTypes.object,
}

export default withStyles(styles)(Description)
