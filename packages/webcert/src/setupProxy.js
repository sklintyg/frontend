/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware')
const { env } = require('process')

module.exports = function(app) {
  app.use(
    ['/fake', '/api', '/moduleapi', '/testability', '/saml', '/error.jsp'],
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

  app.all('/visa/intyg/:id', (req, res) => {
    res.redirect(303, `/certificate/${req.params.id}`)
  })
}
