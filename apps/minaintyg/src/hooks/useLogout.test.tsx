import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { server, waitForRequest } from '../mocks/server'
import { userSchema } from '../schema/user.schema'
import { useGetUserQuery } from '../store/api'
import { store } from '../store/store'
import { useLogout } from './useLogout'

function ComponentWrapper() {
  const { data: user } = useGetUserQuery()
  const logout = useLogout()
  return user ? (
    <button type="button" onClick={logout}>
      Logout
    </button>
  ) : null
}

it('Should call /api/testability/logout when login method is fake', async () => {
  const logoutUrl = '/api/testability/logout'
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.json(fakerFromSchema(userSchema)({ loginMethod: 'FAKE' })))))
  server.use(rest.post(logoutUrl, (_, res, ctx) => res(ctx.text('Success'))))

  const logoutRequest = waitForRequest('POST', logoutUrl)

  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([
            <Route key="1" path="/" element={<ComponentWrapper />} />,
            <Route key="2" path="/welcome" element={<span>Welcome</span>} />,
          ]),
          {
            initialEntries: ['/'],
          }
        )}
      />
    </Provider>
  )
  await screen.findByText('Logout')
  await userEvent.click(screen.getByText('Logout'))
  expect(await logoutRequest).toBeTruthy()
})
