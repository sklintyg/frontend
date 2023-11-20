import { fakerFromSchema } from '@frontend/fake'
import { render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { createMemoryRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom'
import { server } from '../../mocks/server'
import {
  AvailableFunctionsTypeEnum,
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
          availableFunctions: [
            {
              type: AvailableFunctionsTypeEnum.enum.SEND_CERTIFICATE,
            },
          ],
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
      id: '0b295069-d03c-413c-9f4a-b6fd81ad2d87',
      issuer: {
        name: 'Ajla Doktor',
      },
      unit: {
        name: 'Stockholm',
        address: 'Vägen 12',
        zipCode: '123 12',
        city: 'Söder',
        phoneNumber: '123 112 1212',
      },
      careUnit: {
        name: 'Stockholm',
        address: 'Vägen 12',
        zipCode: '123 12',
        city: 'Söder',
        phoneNumber: '123 112 1212',
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

describe('Unable to load certificate', () => {
  function renderWithFault() {
    server.use(rest.get('/api/certificate/:id', (_, res, ctx) => res(ctx.status(500))))

    render(
      <Provider store={store}>
        <RouterProvider
          router={createMemoryRouter(createRoutesFromChildren([<Route key="root" path="/:id" element={<CertificatePage />} />]), {
            initialEntries: ['/12345'],
          })}
        />
      </Provider>
    )
  }

  it('Should render error message', async () => {
    renderWithFault()
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument())
    expect(screen.getAllByRole('alert')).toMatchSnapshot()
  })

  it('Should display fallback description', async () => {
    renderWithFault()
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument())
    expect(screen.getByText(/det här är ditt intyg/i)).toBeInTheDocument()
    expect(screen.getByText(/det här är ditt intyg/i)).toHaveClass('ids-preamble')
  })
})
