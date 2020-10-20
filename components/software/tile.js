import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'
import Button from '@material-ui/core/Button'

import globalStyles from 'shared/styles'

const useStyles = makeStyles(theme => ({
  background: {
    width: '100%',
    height: '300px',
    position: 'relative',
  },
  headerMargin: {
    marginBottom: '16px',
  },
  root: {
    flexGrow: 1,
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    margin: '16px auto',
    width: '100%',
    borderBottom: '1px solid #ccc',
  },
  image: {
    width: 64,
    height: 64,
    marginRight: theme.spacing(2),
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
  layout: globalStyles(theme).layout,
}))

export default function SoftwareTile ({ software }) {
  const classes = useStyles()
  const logo = software.logo && software.logo.find(l => l && l.aspect === 'small')

  return (
    <div className={classNames(classes.root, classes.layout)}>
      <div className={classes.paper}>
        <Grid container>
          <Grid item>
            {logo && (
              <ButtonBase className={classes.image}>
                <img className={classes.img} alt="complex" src={logo.filepath} />
              </ButtonBase>
            )}
          </Grid>
          <Grid className={classes.root} item xs={12} sm container>
            <Grid item xs container direction="column">
              <Grid item xs>
                <Typography gutterBottom component="h1" variant="h4">
                  {software.name}
                </Typography>
                <Typography gutterBottom>{software.desc}</Typography>
              </Grid>
            </Grid>
            <Grid className={classes.rightActions} item>
              <Button variant="contained" color="primary" className={classes.button}>
                Visit Website
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

SoftwareTile.propTypes = {
  classes: PropTypes.object,
  software: PropTypes.object.isRequired,
}
