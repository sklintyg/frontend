import { faker, fakerFromSchema } from '@frontend/fake'
import { render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { expect, it } from 'vitest'
import { SendCertificatePage } from './SendCertificatePage'
import { server } from '../../mocks/server'
import {
  AvailableFunctionsTypeEnum,
  certificateMetadataSchema,
  certificateRecipientSchema,
  certificateSchema,
} from '../../schema/certificate.schema'
import { store } from '../../store/store'

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
              id: '16eb261e-545c-41db-8a6c-59133ead80a4',
              events: [],
              issued: '2023-10-10T13:37:00.000Z',
              issuer: {
                name: 'Jenny Ström',
              },
              summary: {
                label: 'Gäller intygsperiod',
                value: '2021-04-22 - 2021-07-19',
              },
              recipient: fakerFromSchema(certificateRecipientSchema)({
                name: 'Transportstyrelsen',
                sent: null,
              }),
            }),
          }),
          availableFunctions: [
            {
              type: AvailableFunctionsTypeEnum.enum.SEND_CERTIFICATE,
              body: 'Skicka intyget body',
              enabled: true,
            },
          ],
        })
      )
    )
  )
  const { container } = renderComponent()
  expect(await screen.findByTestId('spinner')).toBeInTheDocument()
  await waitFor(() => expect(screen.queryByText('spinner')).not.toBeInTheDocument())
  expect(container).toMatchSnapshot()
})

it('Should render error message when unable to load certificate', async () => {
  server.use(rest.get('/api/certificate/:id', (_, res, ctx) => res(ctx.status(500))))
  renderComponent()
  await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument())
  expect(screen.getAllByRole('alert')).toMatchSnapshot()
})
