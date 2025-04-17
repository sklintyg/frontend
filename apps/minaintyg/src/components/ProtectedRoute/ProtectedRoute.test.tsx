import { render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { server } from '../../mocks/server'
import { store } from '../../store/store'
import { withRouter } from '../../utils/withRouter'
import { ProtectedRoute } from './ProtectedRoute'

function renderComponent() {
  return render(<Provider store={store}>{withRouter(<ProtectedRoute>content</ProtectedRoute>)}</Provider>)
}

it('Should not render children while loading', async () => {
  const { container } = renderComponent()

  expect(container).toBeEmptyDOMElement()
})

it('Should render children when user is available', async () => {
  renderComponent()
  expect(await screen.findByText('content')).toBeInTheDocument()
})

it('Should display dialog when there is 5 minutes left of the session', async () => {
  server.use(rest.get('/api/session/ping', (_, res, ctx) => res(ctx.status(200), ctx.json({ hasSession: true, secondsUntilExpire: 300 }))))
  renderComponent()

  expect(await screen.findByText('content')).toBeInTheDocument()

  expect(await screen.findByText('Vill du fortsätta vara inloggad?')).toBeInTheDocument()
})

it('Should log out saml user when session-expired event is triggered', async () => {
  const formSubmitSpy = vi.spyOn(HTMLFormElement.prototype, 'submit')
  server.use(
    rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json({ loginMethod: 'SAML' }))),
    rest.get('/api/session/ping', (_, res, ctx) => res(ctx.status(200), ctx.json({ hasSession: true, secondsUntilExpire: 10 })))
  )

  renderComponent()

  window.dispatchEvent(new Event('session-expired'))

  await waitFor(() => {
    expect(formSubmitSpy).toHaveBeenCalled()
  })
})
