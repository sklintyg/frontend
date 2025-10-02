import { fakerFromSchema } from '@frontend/fake'
import { render, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { createMemoryRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom'
import { server, waitForRequest } from '../../mocks/server'
import { userSchema } from '../../schema/user.schema'
import { api } from '../../store/api'
import { store } from '../../store/store'
import { LogoutPage } from './LogoutPage'

it('Should call /api/testability/logout when login method is fake', async () => {
  const logoutUrl = '/api/testability/logout'
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.json(fakerFromSchema(userSchema)({ loginMethod: 'FAKE' })))))
  server.use(rest.post(logoutUrl, (_, res, ctx) => res(ctx.text('Success'))))
  store.dispatch(api.endpoints.getUser.initiate())

  const logoutRequest = waitForRequest('POST', logoutUrl)

  await waitFor(() => {
    expect(api.endpoints.getUser.select()(store.getState()).isSuccess).toBe(true)
  })

  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([
            <Route key="1" path="/" element={<LogoutPage />} />,
            <Route key="2" path="/welcome" element={<span>Welcome</span>} />,
          ]),
          {
            initialEntries: ['/'],
          }
        )}
      />
    </Provider>
  )

  expect(await logoutRequest).toBeTruthy()
})
