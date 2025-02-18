import { screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { server, waitForRequest } from '../mocks/server'
import { api } from '../store/api'
import { store } from '../store/store'
import { fakeUser } from '../utils/fake/fakeUser'
import { renderWithRouter } from '../utils/renderWithRouter'
import { useLogout } from './useLogout'

function TestComponent() {
  const { logout } = useLogout()
  return (
    <Routes>
      <Route
        path="/"
        element={
          <button type="button" onClick={logout}>
            Logout{' '}
          </button>
        }
      />
      <Route path="/welcome" element={<p>Welcome</p>} />
    </Routes>
  )
}

describe('useLogout', () => {
  it('Should call /logout and redirect to welcome screen for fake user', async () => {
    server.use(
      rest.get(`/api/user`, (_, res, ctx) =>
        res(ctx.status(200), ctx.json(fakeUser({ authenticationScheme: 'urn:inera:rehabstod:siths:fake' })))
      )
    )
    server.use(rest.post('/logout', (_, res, ctx) => res(ctx.status(302))))
    store.dispatch(api.endpoints.getUser.initiate())

    const { user } = renderWithRouter(<TestComponent />)

    await waitForRequest('GET', '/api/user')

    const pendingRequest = waitForRequest('POST', '/api/testability/logout')

    expect(screen.getByText('Logout')).toBeInTheDocument()

    await user.click(screen.getByText('Logout'))

    await pendingRequest

    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Should open siths logout URL for regular user', async () => {
    server.use(rest.get(`/api/user`, (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ authenticationScheme: 'other' })))))
    server.use(rest.post('/logout', (_, res, ctx) => res(ctx.status(302))))
    store.dispatch(api.endpoints.getUser.initiate())

    const openSpy = vi.spyOn(window, 'open')

    const { user } = renderWithRouter(<TestComponent />)

    await waitForRequest('GET', '/api/user')

    expect(screen.getByText('Logout')).toBeInTheDocument()

    await user.click(screen.getByText('Logout'))

    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledWith('/saml/logout', '_self')
    })
  })
})
