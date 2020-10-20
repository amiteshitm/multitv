import { ApolloServer } from 'apollo-server-express'
import isEmpty from 'lodash'

import getConfig from 'next/config'

import schema from 'server/graph/schema'
import authenticate from 'server/authenticate'
import { connectDatabase } from 'server/lib/db_connect'
import context from './context'

const express = require('express')
const next = require('next')
const pathMatch = require('path-match')
const { parse } = require('url')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const port = parseInt(process.env.PORT, 10) || 7000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const route = pathMatch()

// passport imports
const passport = require('passport')
const configPassport = require('server/auth/passport')

const user = require('./routes/user.routes')

express.Router({ strict: true })

configPassport(passport)

app.prepare().then(() => {
  const server = express()

  const { publicRuntimeConfig } = getConfig()

  connectDatabase()

  const corsOptions = {
    origin: publicRuntimeConfig.graphql,
    credentials: true
  }

  // for login
  server.use(bodyParser.json({ type: 'application/json' }))
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(passport.initialize())
  server.use(cookieParser())
  server.use(cors(corsOptions))

  const apolloServer = new ApolloServer({
    schema,
    context,
    cors: false
  })

  apolloServer.applyMiddleware({ app: server, cors: false })

  server.use('/api/auth', user)
  // server.use('/api', routes)

  server.use('/admin/*', async (req, res, next) => {
    if (!req.cookies.jwt) {
      res.status(404).end()
      return
    }

    const user = await authenticate(req.cookies.jwt)

    if (!(user && user.hasRole('admin'))) {
      res.status(404).end()
      return
    }

    next()
  })

  server.get('/broker/:slug', (req, res) => {
    if (req.params.slug === undefined || req.params.slug === null) {
      return handle(req, res)
    }

    app.render(req, res, '/broker', req.params)
  })

  server.get('/category/:slug', (req, res) => {
    if (req.params.slug === undefined || req.params.slug === null) {
      return handle(req, res)
    }

    app.render(req, res, '/category', req.params)
  })

  server.get('/category/:slug/:pricing', (req, res) => {
    if (req.params.slug === undefined || req.params.slug === null) {
      return handle(req, res)
    }

    app.render(req, res, '/category', req.params)
  })

  server.get('/tagged/:tag', (req, res) => {
    if (req.params.tag === undefined || req.params.tag === null) {
      return handle(req, res)
    }

    app.render(req, res, '/tagged', req.params)
  })

  server.get('/alternatives/:slug', (req, res) => {
    if (req.params.slug === undefined || req.params.slug === null) {
      return handle(req, res)
    }

    app.render(req, res, '/alternatives', req.params)
  })

  server.get('/signin', (req, res, next) => {
    if (!isEmpty(req.cookies.jwt)) {
      return res.redirect(301, '/')
    }
    app.render(req, res, '/signin')
    next()
  })

  server.get('/calculator', (req, res, next) => {
    app.render(req, res, '/calculator')
    next()
  })

  server.use(express.static('public'))
  server.get('/favicon.ico', (req, res) => res.sendStatus(204))

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
