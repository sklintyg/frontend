import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { server } from './mocks/server'
import { routes } from './routes'
import { store } from './store/store'

it('Should display session ended information after 400 request', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(403))))
  render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/intyg'] })} />
    </Provider>
  )

  expect(await screen.findByRole('heading', { name: 'Du är utloggad', level: 1 })).toBeInTheDocument()
})
