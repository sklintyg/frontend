/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware')
const { env } = require('process')

module.exports = function(app) {
  app.use(
    ['/fake', '/api', '/moduleapi', '/testability', '/visa', '/saml'],
    createProxyMiddleware({
      target: env.API_TARGET,
      cookieDomainRewrite: { '*': '' },
      protocolRewrite: env.HTTPS === 'true' ? 'https' : 'http',
      changeOrigin: true,
      autoRewrite: true,
    })
  )
}
