import { faker, fakerFromSchema } from '@frontend/fake'
import { render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { expect, it, describe, vi } from 'vitest'
import { CertificatePage } from './CertificatePage'
import { server, waitForRequest } from '../../mocks/server'
import {
  AvailableFunctionsTypeEnum,
  CertificateMetadata,
  certificateMetadataSchema,
  certificateRecipientSchema,
  certificateSchema,
} from '../../schema/certificate.schema'
import { startSession } from '../../store/slice/session.slice'
import { store } from '../../store/store'

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

  it('Should log error and display id', async () => {
    store.dispatch(startSession())
    server.use(rest.get('/api/certificate/:id', (_, res, ctx) => res(ctx.status(500))))
    const pendingLogRequest = waitForRequest('POST', '/api/log/error')

    vi.stubGlobal('crypto', { randomUUID: faker.datatype.uuid })

    renderWithFault()

    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument())
    const logRequest = await pendingLogRequest
    const logResult = await logRequest.json<{ id: string; code: number; message: string }>()

    expect(logResult).toMatchObject({
      code: 500,
      message: "'Rejected' method 'GET' url '/api/certificate/12345'",
    })

    expect(screen.getByText(logResult.id)).toBeInTheDocument()
  })
})
