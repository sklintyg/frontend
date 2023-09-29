import { faker, fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { server } from '../../mocks/server'
import { certificateSchema } from '../../schema/certificate.schema'
import { store } from '../../store/store'
import { CertificatePage } from './CertificatePage'

it('Should have article content', async () => {
  faker.seed(1234123)
  server.use(
    rest.get('/api/certificate/:id', (_, res, ctx) =>
      res(ctx.json(fakerFromSchema(certificateSchema)({ content: [{ heading: 'Rubrik 1', body: '<p>Test</p>' }] })))
    )
  )

  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromChildren([<Route key="root" path="/:id" element={<CertificatePage />} />]), {
          initialEntries: ['/12345'],
        })}
      />
    </Provider>
  )

  expect(await screen.findByTestId('spinner')).toBeInTheDocument()
  expect(await screen.findByRole('article')).toBeInTheDocument()
  expect(screen.getByRole('article')).toMatchSnapshot()
})
