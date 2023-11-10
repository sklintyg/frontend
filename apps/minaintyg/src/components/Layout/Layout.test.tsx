import { act, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Outlet, Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { waitForRequest } from '../../mocks/server'
import { updateHasSessionEnded } from '../../store/slice/session.slice'
import { store } from '../../store/store'
import { Layout } from './Layout'

it('Should render as expected', async () => {
  const userRequest = waitForRequest('GET', '/api/user')

  const { container } = render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([
            <Route
              key="root"
              path="/"
              element={
                <Layout>
                  <Outlet />
                </Layout>
              }
            >
              <Route index element={<p>FooBar</p>} />
            </Route>,
          ]),
          { initialEntries: ['/'] }
        )}
      />
    </Provider>
  )

  await act(async () => userRequest)

  expect(container).toMatchSnapshot()
})

it('Should display session ended information', () => {
  store.dispatch(updateHasSessionEnded(true))
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromChildren([<Route key="root" path="/" element={<Layout>Test</Layout>} />]), {
          initialEntries: ['/'],
        })}
      />
    </Provider>
  )
  expect(screen.getByRole('heading', { name: 'Du är utloggad', level: 1 })).toBeInTheDocument()
})
