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
  server.use(rest.get('/api/session/ping', (_, res, ctx) => res(ctx.status(200), ctx.json({ hasSession: true, secondsUntilExpire: 250 }))))
  renderComponent()

  expect(await screen.findByText('content')).toBeInTheDocument()

  expect(await screen.findByText('Vill du fortsätta vara inloggad?')).toBeInTheDocument()
})

it('Should redirect to saml login when unable to load user', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(500))))
  const openSpy = vi.spyOn(window, 'open')

  renderComponent()

  await waitFor(() => {
    expect(openSpy).toHaveBeenCalledWith('/saml2/authenticate/eleg', '_self')
  })
})
