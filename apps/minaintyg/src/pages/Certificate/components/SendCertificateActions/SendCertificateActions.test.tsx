import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Outlet, Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { expect, it } from 'vitest'
import { SendCertificateActions } from './SendCertificateActions'
import { server } from '../../../../mocks/server'
import {
  AvailableFunction,
  CertificateRecipient,
  availableFunctionSchema,
  certificateRecipientSchema,
} from '../../../../schema/certificate.schema'
import { store } from '../../../../store/store'

function renderComponent(recipient: CertificateRecipient, sendFunction: AvailableFunction) {
  return render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([
            <Route key="cert" path="/" element={<Outlet />}>
              <Route index element={<p>Certificate page</p>} />
              <Route path="skicka" element={<SendCertificateActions id="12345" recipient={recipient} sendFunction={sendFunction} />} />,
            </Route>,
          ]),
          {
            initialEntries: ['/skicka'],
          }
        )}
      />
    </Provider>
  )
}

it('Should display message when certificate is sent', async () => {
  renderComponent(
    fakerFromSchema(certificateRecipientSchema)({ sent: '2023-10-23T11:13:37.000Z' }),
    fakerFromSchema(availableFunctionSchema)({ enabled: false })
  )

  expect(screen.getByText(/ditt intyg har skickats till följande mottagare:/i)).toBeInTheDocument()
})

it('Should display error-message when certificate was unable to be sent', async () => {
  server.use(rest.post('/api/certificate/:id/send', (req, res, ctx) => res(ctx.status(500))))
  renderComponent(
    fakerFromSchema(certificateRecipientSchema)({ sent: '2023-10-23T11:13:37.000Z' }),
    fakerFromSchema(availableFunctionSchema)({ enabled: true })
  )

  await userEvent.click(screen.getByRole('button', { name: 'Skicka' }))

  expect(screen.getByText(/på grund av ett tekniskt fel kunde ditt intyg inte skickas till följande mottagare:/i)).toBeInTheDocument()
})

it('Should navigate back when pressing the back button', async () => {
  renderComponent(
    fakerFromSchema(certificateRecipientSchema)({ sent: '2023-10-23T11:13:37.000Z' }),
    fakerFromSchema(availableFunctionSchema)({ enabled: false })
  )
  await userEvent.click(screen.getByRole('button', { name: 'Tillbaka till intyget' }))
  expect(screen.getByText('Certificate page')).toBeInTheDocument()
})
