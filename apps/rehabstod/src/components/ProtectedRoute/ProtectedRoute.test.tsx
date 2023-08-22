import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { server } from '../../mocks/server'
import { store } from '../../store/store'
import { fakeUser } from '../../utils/fake/fakeUser'
import { ProtectedRoute } from './ProtectedRoute'

it('Should navigate to /enhet if unit is missing', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ valdVardenhet: null })))))
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([
            <Route
              key="1"
              path="/"
              element={
                <ProtectedRoute requireUnit>
                  <p>Protected Route</p>
                </ProtectedRoute>
              }
            />,
            <Route key="2" path="/enhet" element={<p>Choose unit</p>} />,
          ])
        )}
      />
    </Provider>
  )
  expect(await screen.findByText('Choose unit')).toBeInTheDocument()
})

it('Should navigate to start if user is missing', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json({}))))
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([
            <Route
              key="1"
              path="/user-route"
              element={
                <ProtectedRoute>
                  <p>Protected Route</p>
                </ProtectedRoute>
              }
            />,
            <Route key="2" path="/" element={<p>Start</p>} />,
          ]),
          { initialEntries: ['/user-route'] }
        )}
      />
    </Provider>
  )
  expect(await screen.findByText('Start')).toBeInTheDocument()
})
