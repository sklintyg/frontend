import { screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import { server, waitForRequest } from '../mocks/server'
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
      rest.get('/api/session-auth-check/ping', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            hasSession: true,
            secondsUntilExpire: 0,
            authenticated: false,
          })
        )
      )
    )
    server.use(
      rest.get(`/api/user`, (_, res, ctx) =>
        res(ctx.status(200), ctx.json(fakeUser({ authenticationScheme: 'urn:inera:rehabstod:siths:fake' })))
      )
    )
    server.use(rest.post('/logout', (_, res, ctx) => res(ctx.status(302))))

    const { user } = renderWithRouter(<TestComponent />)

    await waitForRequest('GET', '/api/user')

    const pendingRequest = waitForRequest('POST', '/logout')

    expect(screen.getByText('Logout')).toBeInTheDocument()

    await user.click(screen.getByText('Logout'))

    const request = await pendingRequest

    expect(request.headers.get('content-type')).toEqual('application/x-www-form-urlencoded')

    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  it('Should open siths logout URL for regular user', async () => {
    server.use(rest.get(`/api/user`, (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ authenticationScheme: 'other' })))))
    server.use(rest.post('/logout', (_, res, ctx) => res(ctx.status(302))))

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
