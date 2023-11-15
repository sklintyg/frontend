import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { server } from './mocks/server'
import { routes } from './routes'
import { store } from './store/store'

it('Should display session ended information after 403 request', async () => {
  server.use(rest.post('/api/certificate', (req, res, ctx) => res(ctx.status(403))))
  render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/intyg'] })} />
    </Provider>
  )

  expect(await screen.findByRole('heading', { name: 'Du är utloggad', level: 1 })).toBeInTheDocument()
})

it('Should display session unavailable after 503 request', async () => {
  server.use(rest.post('/api/certificate', (req, res, ctx) => res(ctx.status(503))))
  render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/intyg'] })} />
    </Provider>
  )

  expect(await screen.findByRole('heading', { name: 'Tjänsten är inte tillgänglig just nu', level: 1 })).toBeInTheDocument()
})

it('Should display unknown error after 504 request', async () => {
  server.use(rest.post('/api/certificate', (req, res, ctx) => res(ctx.status(504))))
  render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/intyg'] })} />
    </Provider>
  )

  expect(await screen.findByRole('heading', { name: 'Någonting gick fel', level: 1 })).toBeInTheDocument()
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
