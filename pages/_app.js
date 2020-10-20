import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'

import Head from 'next/head'
import { parseCookies } from 'nookies'

import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles'

import withReduxStore from 'helpers/with-redux-store'
import getPageContext from 'getPageContext'
import { UserProvider } from 'util/user.context'

class MyApp extends App {
  pageContext = getPageContext()

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const cookies = parseCookies(ctx)

    if (cookies.user) {
      pageProps.user = JSON.parse(cookies.user)
    }

    return { pageProps }
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props
    const { theme } = this.pageContext
    const { user } = pageProps

    return (
      <>
        <Head>
          <meta
            name="description"
            content="Fintrakk picks the best software for you"
            key="description"
          />
        </Head>
        <Provider store={reduxStore}>
          <MuiThemeProvider theme={theme}>
            <UserProvider value={{ user }}>
              <Component pageContext={this.pageContext} {...pageProps} />
            </UserProvider>
          </MuiThemeProvider>
        </Provider>
      </>
    )
  }
}

export default withReduxStore(MyApp)
