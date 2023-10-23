import { faker, fakerFromSchema } from '@frontend/fake'
import { render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { server } from '../../mocks/server'
import { certificateMetadataSchema, certificateRecipientSchema, certificateSchema } from '../../schema/certificate.schema'
import { store } from '../../store/store'
import { SendCertificatePage } from './SendCertificatePage'

function renderComponent() {
  return render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromChildren([<Route key="root" path="/:id" element={<SendCertificatePage />} />]), {
          initialEntries: ['/12345'],
        })}
      />
    </Provider>
  )
}

it('Should render as expected', async () => {
  faker.seed(412341)
  server.use(
    rest.get('/api/certificate/:id', (_, res, ctx) =>
      res(
        ctx.json({
          certificate: fakerFromSchema(certificateSchema)({
            metadata: fakerFromSchema(certificateMetadataSchema)({
              events: [],
              issued: '2023-10-10T13:37:00.000Z',
              recipient: fakerFromSchema(certificateRecipientSchema)({
                sent: null,
              }),
            }),
          }),
        })
      )
    )
  )
  const { container } = renderComponent()
  expect(await screen.findByTestId('spinner')).toBeInTheDocument()
  await waitFor(() => expect(screen.queryByText('spinner')).not.toBeInTheDocument())
  expect(container).toMatchSnapshot()
})
