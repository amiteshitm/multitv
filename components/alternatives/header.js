import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    margin: '16px auto',
    justifyContent: 'center',
    textAlign: 'center',
    borderBottom: '1px solid #ccc',
    width: 'auto',
  },
  image: {
    width: 64,
    height: 64,
    marginRight: theme.spacing(2),
  },
  root: {
    alignItems: 'center',
  },
  descContainer: {
    justifyContent: 'space-evenly',
  },
}))

const pageTitle = software => `Alternatives & Competitors to ${software.name}`
const pageSubTitle = software => `List of best alternatives & products related to ${software.name}`

const PageHeader = ({ software }) => {
  const classes = useStyles()
  const { logo, desc } = software

  return (
    <Grid className={classNames(classes.root, classes.container)} container>
      <Grid item>
        {logo && (
          <ButtonBase className={classes.image}>
            <img className={classes.img} alt="complex" src={logo.filepath} width="64" height="64" />
          </ButtonBase>
        )}
      </Grid>
      <Grid className={classes.descContainer} item xs={12} sm container>
        <Grid item xs={12}>
          <Typography gutterBottom component="h1" variant="h4">
            {pageTitle(software)}
          </Typography>
        </Grid>
        <Typography gutterBottom>{pageSubTitle(software)}</Typography>
        <Typography gutterBottom variant="body2">
          {desc}
        </Typography>
      </Grid>
    </Grid>
  )
}

PageHeader.propTypes = {
  software: PropTypes.object.isRequired,
}

export default PageHeader
