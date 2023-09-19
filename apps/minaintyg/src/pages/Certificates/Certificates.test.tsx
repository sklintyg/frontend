import { render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { server } from '../../mocks/server'
import { store } from '../../store/store'
import { Certificates } from './Certificates'

beforeEach(() => {
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromChildren([<Route key="root" path="/" element={<Certificates />} />]), {
          initialEntries: ['/'],
        })}
      />
    </Provider>
  )
})

it('Should have correct heading', () => {
  expect(screen.getByRole('heading', { level: 1 })).toMatchSnapshot()
})

it('Should render alert message when list is empty', async () => {
  server.use(rest.post('/api/certificate', (_, res, ctx) => res(ctx.status(200), ctx.json({ content: [] }))))
  expect(await screen.findByRole('alert')).toMatchSnapshot()
})

it('Should have correct paragraph', () => {
  expect(screen.getByText(/här listas dina läkarintyg/i)).toMatchSnapshot()
})

it('Should render list of certificates', async () => {
  expect(screen.getByTestId('certificate-list-spinner')).toBeInTheDocument()
  await waitFor(() => expect(screen.queryByTestId('certificate-list-spinner')).not.toBeInTheDocument())
})
