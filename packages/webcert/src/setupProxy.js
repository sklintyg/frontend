/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware')
const { env } = require('process')
const querystring = require('querystring')

module.exports = function(app) {
  app.use(
    ['/fake', '/api', '/moduleapi', '/testability', '/visa', '/saml', '/error.jsp', '/logout'],
    createProxyMiddleware({
      target: env.API_TARGET,
      cookieDomainRewrite: { '*': '' },
      protocolRewrite: env.HTTPS === 'true' ? 'https' : 'http',
      changeOrigin: true,
      autoRewrite: true,
      logger: (...args) => {
        if (env.HTTP_PROXY_LOGS !== 'false') {
          console.log.call(args)
        }
      },
    })
  )
}
