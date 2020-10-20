const path = require('path')
const fs = require('fs')

const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
const withLess = require('@zeit/next-less')
const lessToJS = require('less-vars-to-js')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

require('dotenv').config({
  path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`)
})

const prod = process.env.NODE_ENV === 'production'

// Where your antd-custom.less file lives
const themeVars = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
)

module.exports = (nextConfig = {}) => {
  return {
    ...nextConfig,
    serverRuntimeConfig: {
      // Will only be available on the server side
      mySecret: 'secret',
      uploadBucket: prod ? 'uploads.fintrakk.com' : 'test.fintrakk.com',
      aspectBucket: prod ? 'aspects.fintrakk.com' : 'test.fintrakk.com',
      database: {
        name: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: 27017
      },
      jwtSecret:
        '<mNEj5:RVMLXu*}QtE,"8xm#F$RJ)huP5(w-@d.Cq;%?C#U9X5I!t,v/ccHkDz4'
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      port: 7000,
      SITE_URI: prod ? 'fintrakk.com' : 'localhost:7000',
      SITE_SCHEME: prod ? 'https' : 'http',
      graphql: prod
        ? 'https://fintrakk.com/graphql'
        : 'http://localhost:7000/graphql',
      SITE_HOST: prod ? 'https://fintrakk.com' : 'http://localhost:7000',
      cmsGraphql: prod
        ? 'https://cms.fintrakk.com/graphql'
        : 'http://localhost:1337/graphql'
    },
    webpack(config, options) {
      const lessConfig = withLess({
        ...nextConfig,
        webpack: undefined,
        lessLoaderOptions: {
          javascriptEnabled: true,
          modifyVars: themeVars
        }
      }).webpack(config, options)
      const { dev, isServer } = options
      // prevent Node.js loading less files in SSR mode
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/
        const origExternals = [...lessConfig.externals]
        lessConfig.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback()
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback)
            } else {
              callback()
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals)
        ]
        lessConfig.module.rules.unshift({
          test: antStyles,
          use: 'null-loader'
        })
      }
      // hack the next-less, exclude ant design less filess
      const lessConf = {
        exclude: /node_modules\/antd/,
        ...lessConfig.module.rules.pop()
      }
      lessConfig.module.rules.push(lessConf)
      // load ant design less files
      lessConfig.module.rules.push({
        test: /\.less$/,
        include: /node_modules\/antd/,
        use: cssLoaderConfig(lessConfig, {
          extensions: ['less'],
          cssModules: false,
          cssLoaderOptions: {},
          dev,
          isServer,
          loaders: [
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
                modifyVars: themeVars
              }
            }
          ]
        })
      })
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }
      return lessConfig
    }
  }
}
