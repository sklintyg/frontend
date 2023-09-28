import { fakerFromSchema } from '@frontend/fake'
import { render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { server } from '../../mocks/server'
import { certificateMetadataSchema } from '../../schema/certificate.schema'
import { store } from '../../store/store'
import { CertificateListPage } from './CertificateListPage'

beforeEach(() => {
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromChildren([<Route key="root" path="/" element={<CertificateListPage />} />]), {
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
  server.use(
    rest.post('/api/certificate', (_, res, ctx) =>
      res(ctx.status(200), ctx.json({ content: Array.from({ length: 6 }, fakerFromSchema(certificateMetadataSchema)) }))
    )
  )
  expect(screen.getByTestId('certificate-list-spinner')).toBeInTheDocument()
  await waitFor(() => expect(screen.queryByTestId('certificate-list-spinner')).not.toBeInTheDocument())
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6)
})
