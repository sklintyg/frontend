/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    ['/fake', '/api', '/moduleapi', '/testability'],
    createProxyMiddleware({
      target: 'http://localhost:8020',
      changeOrigin: true,
    })
  )
}
