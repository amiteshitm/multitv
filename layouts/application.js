import React from 'react'
import PropTypes from 'prop-types'
import fetch from 'isomorphic-unfetch'
import { addError, addSuccess } from 'redux-flash-messages'

import Router from 'next/router'
import getConfig from 'next/config'
import { destroyCookie } from 'nookies'

import ReactGA from 'react-ga'
import { enquireScreen } from 'enquire-js'

import UserContext from 'util/user.context'
import Nav3 from 'layouts/header/nav3'

class PrimarySearchAppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMobile: null
    }
  }

  componentDidMount() {
    enquireScreen(b => {
      this.setState({ isMobile: !!b })
    })

    if (process.env.NODE_ENV === 'production') {
      if (!window.GA_INITIALIZED) {
        this.initGA()
        window.GA_INITIALIZED = true
      }
      this.logPageView()

      // save possible previously defined callback
      const previousCallback = Router.onRouteChangeComplete
      Router.onRouteChangeComplete = () => {
        // call previously defined callback if is a function
        if (typeof previousCallback === 'function') {
          previousCallback()
        }
        // log page
        this.logPageView()
      }
    }
  }

  initGA = () => {
    ReactGA.initialize('UA-77810808-2')
  }

  logPageView = () => {
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }

  logout = () => {
    const { publicRuntimeConfig } = getConfig()

    const logoutURL = `${publicRuntimeConfig.SITE_HOST}/api/auth/logout`

    fetch(logoutURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(res => {
        destroyCookie({}, 'user')
        destroyCookie({}, 'signedin')

        addSuccess({ text: 'Succesfully Logged Out' })
        Router.push('/')
      })
      .catch(err => {
        addError({ text: `Error:${err}` })
        console.log(err)
      })
  }

  render() {
    const { isMobile } = this.state
    const { user } = this.context
    const { children } = this.props

    return (
      <div>
        <Nav3 isMobile={isMobile} />
        {children}
      </div>
    )
  }
}

PrimarySearchAppBar.contextType = UserContext

export default PrimarySearchAppBar
