import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { server } from './mocks/server'
import { routes } from './routes'
import { store } from './store/store'

it.each([
  [403, 'Du är utloggad'],
  [503, 'Tjänsten är inte tillgänglig just nu'],
  [504, 'Någonting gick fel'],
] as const)('Should display %s when request status is %i', async (status, headline) => {
  server.use(rest.post('/api/certificate', (_, res, ctx) => res(ctx.status(status))))
  render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/intyg'] })} />
    </Provider>
  )

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
