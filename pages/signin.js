import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import fetch from 'isomorphic-unfetch'

import { addSuccess, addError } from 'redux-flash-messages'
import getConfig from 'next/config'
import Router from 'next/router'
import { setCookie } from 'nookies'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

import TextField from 'helpers/form/text-field'
import FlashMessages from 'helpers/flash-messages'
import ApplicationLayout from 'layouts/application'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const onSubmit = values => {
  const { publicRuntimeConfig } = getConfig()

  const loginURL = `${publicRuntimeConfig.SITE_HOST}/api/auth/login`

  fetch(loginURL, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        setCookie({}, 'signedin', true)
        setCookie({}, 'user', JSON.stringify(res.user))

        addSuccess({ text: res.message })
        Router.push('/')
      } else {
        addError({ text: res.message })
      }
    })
    .catch(err => {
      console.log(err)
      addError({ text: err.message })
    })
}

function SignIn (props) {
  const classes = useStyles()

  const { handleSubmit, isSubmitting, isEditing } = props

  return (
    <ApplicationLayout>
      <FlashMessages />
      <Container maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <Field
              name={'email'}
              label="Email Address"
              placeholder="Email"
              disabled={isSubmitting || isEditing}
              component={TextField}
              fullWidth={true}
              margin="normal"
            />
            <Field
              name={'password'}
              label="Password"
              placeholder="Password"
              disabled={isSubmitting || isEditing}
              component={TextField}
              type="password"
              fullWidth={true}
              margin="normal"
            />
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Sign In
            </Button>
          </form>
        </div>
      </Container>
    </ApplicationLayout>
  )
}

SignIn.propTypes = {
  handleSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  isEditing: PropTypes.bool,
}

export default reduxForm({
  form: 'LoginForm',
  validate: values => {
    const errors = {}

    if (!values.email) {
      errors.email = 'Email is a required field'
    }

    if (!values.password) {
      errors.password = 'Password is a required field'
    }
  },
})(SignIn)
