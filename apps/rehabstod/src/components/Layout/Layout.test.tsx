import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { server } from '../../mocks/server'
import { BannerPriority, configSchema } from '../../schemas'
import { api } from '../../store/api'
import { store } from '../../store/store'
import { Layout } from './Layout'

it('Should halt and display user fetching error', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(504))))
  store.dispatch(api.endpoints.getUser.initiate())
  render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={<Layout />} />))} />
    </Provider>
  )

  expect(await screen.findByText(/tekniskt problem, försök igen om en stund/i)).toBeInTheDocument()
})

it('Should display a link in a banner as a link', async () => {
  const banner = {
    application: 'REHABSTOD',
    createdAt: '2026-11-01T08:00:00',
    displayFrom: '2026-11-01T08:00:00',
    displayTo: '2026-11-30T08:00:00',
    id: 'banner-1',
    message: 'Läs mer <a href="https://example.com/drift" target="_blank" rel="noopener noreferrer">här</a>',
    priority: BannerPriority.MEDIUM,
  }
  server.use(rest.get('/api/config', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(configSchema)({ banners: [banner] })))))
  render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={<Layout />} />))} />
    </Provider>
  )

  expect(await screen.findByRole('link', { name: 'här' })).toHaveAttribute('href', 'https://example.com/drift')
})
