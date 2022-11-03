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
    })
  )

  app.post('/visa/intyg/:id', (req, res) => {
    res.redirect(303, `/certificate/${req.params.id}`)
  })
}
