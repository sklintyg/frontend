import { act, render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { server, waitForRequest } from './mocks/server'
import { routes } from './routes'
import { store } from './store/store'

it.each([
  ['Du är utloggad', 403],
  ['Tjänsten är inte tillgänglig just nu', 503],
  ['Någonting gick fel', 504],
] as const)('Should display %s when request status is %s', async (headline, status) => {
  server.use(rest.post('/api/certificate', (_, res, ctx) => res(ctx.status(status))))
  const userRequest = waitForRequest('GET', '/api/user')
  const certificateListRequest = waitForRequest('POST', '/api/certificate')
  render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/intyg'] })} />
    </Provider>
  )

  await act(async () => userRequest)
  await act(async () => certificateListRequest)

  expect(await screen.findByRole('heading', { name: headline, level: 1 })).toBeInTheDocument()
})

it('Should end session when visiting /logga-ut', async () => {
  render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/logga-ut'] })} />
    </Provider>
  )

  expect(await screen.findByRole('heading', { name: 'Du är utloggad', level: 1 })).toBeInTheDocument()
  expect(store.getState().sessionSlice.hasSessionEnded).toBe(true)
})
