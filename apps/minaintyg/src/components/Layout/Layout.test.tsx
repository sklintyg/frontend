import { act, render } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { server, waitForRequest } from '../../mocks/server'
import { store } from '../../store/store'
import { Layout } from './Layout'

it('Should render as expected', async () => {
  const userRequest = waitForRequest('GET', '/api/user')

  const { baseElement } = render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([
            <Route key="root" path="/" element={<Layout />}>
              <Route index element={<p>FooBar</p>} />
            </Route>,
          ]),
          { initialEntries: ['/'] }
        )}
      />
    </Provider>
  )

  await act(async () => userRequest)

  expect(baseElement).toMatchSnapshot()
})

it('Should render without header when user is not logged in', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(400))))
  const userRequest = waitForRequest('GET', '/api/user')

  const { baseElement } = render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([
            <Route key="root" path="/" element={<Layout />}>
              <Route index element={<p>FooBar</p>} />
            </Route>,
          ]),
          { initialEntries: ['/'] }
        )}
      />
    </Provider>
  )

  await act(async () => userRequest)

  expect(baseElement).toMatchSnapshot()
})
