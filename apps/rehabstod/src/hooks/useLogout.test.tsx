import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { server, waitForRequest } from '../mocks/server'
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
            Logout
          </button>
        }
      />
      <Route path="/welcome" element={<p>Welcome</p>} />
    </Routes>
  )
}

describe('useLogout', () => {
  it('Should call /logout and redirect to welcome screen', async () => {
    const { user } = renderWithRouter(<TestComponent />)

    server.use(rest.post('/logout', (req, res, ctx) => res(ctx.status(302))))

    const pendingRequest = waitForRequest('POST', '/logout')

    expect(screen.getByText('Logout')).toBeInTheDocument()

    await user.click(screen.getByText('Logout'))

    const request = await pendingRequest

    expect(request.headers.get('content-type')).toEqual('application/x-www-form-urlencoded')

    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })
})
