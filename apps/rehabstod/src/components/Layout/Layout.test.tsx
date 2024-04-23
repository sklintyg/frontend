import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { server } from '../../mocks/server'
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
