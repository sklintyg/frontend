import { render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { server } from '../../mocks/server'
import { store } from '../../store/store'
import { Certificates } from './Certificates'

it('Should have correct heading', () => {
  render(
    <Provider store={store}>
      <Certificates />
    </Provider>
  )
  expect(screen.getByRole('heading', { level: 1 })).toMatchSnapshot()
})

it('Should render alert message when list is empty', async () => {
  server.use(rest.post('/api/certificates', (_, res, ctx) => res(ctx.status(200), ctx.json({ content: [] }))))
  render(
    <Provider store={store}>
      <Certificates />
    </Provider>
  )
  expect(await screen.findByRole('alert')).toMatchSnapshot()
})

it('Should have correct paragraph', () => {
  render(
    <Provider store={store}>
      <Certificates />
    </Provider>
  )
  expect(screen.getByText(/här listas dina läkarintyg/i)).toMatchSnapshot()
})

it('Should render list of certificates', async () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Certificates />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  expect(screen.getByTestId('certificate-list-spinner')).toBeInTheDocument()
  await waitFor(() => expect(screen.queryByTestId('certificate-list-spinner')).not.toBeInTheDocument())
})
