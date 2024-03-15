import { faker, fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { createMemoryRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom'
import { availableFunctionSchema, AvailableFunctionsTypeEnum, certificateRecipientSchema } from '../../../../schema/certificate.schema'
import { CertificateActions } from './CertificateActions'

function renderComponent(props: ComponentProps<typeof CertificateActions>) {
  return render(
    <RouterProvider
      router={createMemoryRouter(
        createRoutesFromChildren([
          <Route key="root" path="/" element={<CertificateActions {...props} />} />,
          <Route key="/skicka" path="/skicka" element={<p>Send page</p>} />,
        ]),
        {
          initialEntries: ['/'],
        }
      )}
    />
  )
}

const id = 'id'
const availableActionsWithSend = [
  fakerFromSchema(availableFunctionSchema)({
    type: AvailableFunctionsTypeEnum.enum.SEND_CERTIFICATE,
    name: 'Skicka intyg',
    information: [],
    enabled: true,
  }),
]

const availableActionsWithSendDisabled = [
  fakerFromSchema(availableFunctionSchema)({
    type: AvailableFunctionsTypeEnum.enum.SEND_CERTIFICATE,
    name: 'Skicka intyg',
    information: [],
    enabled: false,
  }),
]

const availableActionsWithPrint = [
  fakerFromSchema(availableFunctionSchema)({
    type: AvailableFunctionsTypeEnum.enum.PRINT_CERTIFICATE,
    name: 'Skicka intyg',
    information: [],
  }),
]
it('Should hide send button when there is no provided recipient', () => {
  renderComponent({ availableFunctions: availableActionsWithSend, id })
  expect(screen.queryByRole('button', { name: 'Skicka intyg' })).not.toBeInTheDocument()
})

it('Should hide send button when there is no send available function', () => {
  renderComponent({ recipient: fakerFromSchema(certificateRecipientSchema)({ sent: null }), availableFunctions: [], id })
  expect(screen.queryByRole('button', { name: 'Skicka intyg' })).not.toBeInTheDocument()
})

it('Should show send button when there is a provided recipient', () => {
  renderComponent({
    recipient: fakerFromSchema(certificateRecipientSchema)({ sent: null }),
    availableFunctions: availableActionsWithSend,
    id,
  })
  expect(screen.getByRole('button', { name: 'Skicka intyg' })).toBeInTheDocument()
})

it('Should display modal if certificate is already sent', async () => {
  renderComponent({
    recipient: fakerFromSchema(certificateRecipientSchema)({ sent: faker.date.recent().toISOString() }),
    availableFunctions: availableActionsWithSendDisabled,
    id,
  })
  expect(screen.queryByText(/intyget har redan skickats och kan inte skickas igen/i)).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Skicka intyg' }))
  expect(screen.getByText(/intyget har redan skickats och kan inte skickas igen/i)).toBeInTheDocument()
})

it('Should navigate to /skicka when pressing send button', async () => {
  renderComponent({
    recipient: fakerFromSchema(certificateRecipientSchema)({ sent: null }),
    availableFunctions: availableActionsWithSend,
    id,
  })
  await userEvent.click(screen.getByRole('button', { name: 'Skicka intyg' }))
  expect(screen.getByText(/send page/i)).toBeInTheDocument()
})

it('Should hide print button when there is no print availableFunction provided', () => {
  renderComponent({ availableFunctions: availableActionsWithSend, id })
  expect(screen.queryByRole('button', { name: 'Skriv ut' })).not.toBeInTheDocument()
})

it('Should show print button when there is print availableFunction provided', () => {
  renderComponent({ availableFunctions: availableActionsWithPrint, id })
  expect(screen.getByRole('button', { name: 'Skriv ut' })).toBeInTheDocument()
})
