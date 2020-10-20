// ./devServer.js
require('@babel/register')({
  babelrc: false,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: true
        }
      }
    ]
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.']
      }
    ]
  ]
})
require('./express-server')
