import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { server } from '../../mocks/server'
import {
  CertificateMetadata,
  certificateMetadataSchema,
  certificateRecipientSchema,
  certificateSchema,
} from '../../schema/certificate.schema'
import { store } from '../../store/store'
import { CertificatePage } from './CertificatePage'

function renderComponent(metadata: CertificateMetadata) {
  server.use(
    rest.get('/api/certificate/:id', (_, res, ctx) =>
      res(
        ctx.json({
          certificate: fakerFromSchema(certificateSchema)({
            metadata,
            content: [{ heading: 'Rubrik 1', body: '<p>Test</p>' }],
          }),
        })
      )
    )
  )

  return render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromChildren([<Route key="root" path="/:id" element={<CertificatePage />} />]), {
          initialEntries: ['/12345'],
        })}
      />
    </Provider>
  )
}

it('Should have article content', async () => {
  renderComponent(
    fakerFromSchema(certificateMetadataSchema)({
      issuer: {
        name: 'Ajla Doktor',
        phoneNumber: '123456',
      },
      unit: {
        name: 'Stockholm',
        address: 'Vägen 12',
      },
      issued: '2023-10-06T15:20:28',
      recipient: fakerFromSchema(certificateRecipientSchema)({
        sent: null,
      }),
      events: [],
    })
  )
  expect(await screen.findByTestId('spinner')).toBeInTheDocument()
  expect(await screen.findByRole('article')).toBeInTheDocument()
  expect(screen.getByRole('article')).toMatchSnapshot()
})

it('Should display alert message when certificate is replaced', async () => {
  renderComponent(
    fakerFromSchema(certificateMetadataSchema)({
      recipient: null,
      issued: '2023-10-06T15:20:28',
      statuses: ['REPLACED'],
    })
  )

  expect(await screen.findByRole('alert')).toBeInTheDocument()
  expect(screen.getByRole('alert')).toMatchInlineSnapshot(`
    <ids-alert
      role="alert"
    >
      Läkaren kan ersätta ett intyg om till exempel intyget innehåller fel information eller om ny information tillkommit.
    </ids-alert>
  `)
})
