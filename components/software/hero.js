import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import classNames from 'classnames'

import { withStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'

import globalStyles from 'shared/styles'

const styles = theme => ({
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
  },
  image: {
    width: 128,
    height: 128,
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
})

const SoftwareHero = ({ software, ...props }) => {
  const { classes } = props

  return (
    <div className={classNames(classes.root)}>
      <div>
        <Grid container>
          <Grid item>
            {software.logo && (
              <ButtonBase className={classes.image}>
                <img className={classes.img} alt="complex" src={software.logo.filepath} />
              </ButtonBase>
            )}
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column">
              <Grid item xs>
                <Typography gutterBottom component="h1" variant="h4">
                  {software.name}
                </Typography>
                <Typography gutterBottom>{software.desc}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

SoftwareHero.propTypes = {
  classes: PropTypes.object,
  software: PropTypes.object.isRequired,
}

SoftwareHero.fragments = {
  logo: gql`
    fragment SoftwareLogoHero on Software {
      logo(aspect: "small") {
        name
        filepath
      }
    }
  `,
}

export default withStyles(styles)(SoftwareHero)
