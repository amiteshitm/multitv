import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Grid from '@material-ui/core/Grid'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'

import globalStyles from 'shared/styles'
import { isParent } from 'shared/util'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  heading: {
    fontWeight: 'bold',
  },
  icon: {
    margin: theme.spacing(1),
    fontSize: 32,
  },
  expansionDetailsRoot: {
    alignItems: 'center',
  },
  layout: globalStyles(theme).layout,
}))

const Features = ({ software }) => {
  const classes = useStyles()

  const renderFeatureList = software.features.reduce((acc, f) => {
    const feature = f.feature

    if (isParent(feature)) {
      if (!acc[feature.name]) {
        acc[feature.name] = []
      }
      acc[feature.name].push(f)
    } else {
      if (!acc[feature.parent.name]) {
        acc[feature.parent.name] = []
      }
      acc[feature.parent.name].push(f)
    }

    return acc
  }, {})

  return (
    <div className={classnames(classes.root)}>
      <Typography component="h2" variant="h4" gutterBottom>
        {software.name} Features
      </Typography>
      {Object.keys(renderFeatureList).map((feature, idx) => {
        return (
          <ExpansionPanel key={idx} defaultExpanded={true}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={classes.heading}>{feature}</Typography>
            </ExpansionPanelSummary>
            <Grid container key={idx}>
              {renderFeatureList[feature].map((feature, idx) => (
                <Grid key={idx} item xs={12} sm={6} lg={4}>
                  <ExpansionPanelDetails className={classes.expansionDetailsRoot}>
                    <CheckCircleRoundedIcon className={classes.icon} color={'primary'} />
                    <Typography>{feature.feature.name}</Typography>
                  </ExpansionPanelDetails>
                </Grid>
              ))}
            </Grid>
          </ExpansionPanel>
        )
      })}
    </div>
  )
}

Features.propTypes = {
  software: PropTypes.object.isRequired,
}

export default Features
