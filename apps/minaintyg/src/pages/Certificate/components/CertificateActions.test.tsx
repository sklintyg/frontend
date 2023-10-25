import { faker, fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { certificateRecipientSchema } from '../../../schema/certificate.schema'
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

it('Should hide send button when there is no provided recipient', () => {
  renderComponent({})
  expect(screen.queryByRole('button', { name: 'Skicka intyg' })).not.toBeInTheDocument()
})

it('Should show send button when there is a provided recipient', () => {
  renderComponent({ recipient: fakerFromSchema(certificateRecipientSchema)({ sent: null }) })
  expect(screen.getByRole('button', { name: 'Skicka intyg' })).toBeInTheDocument()
})

it('Should display modal if certificate is already sent', async () => {
  renderComponent({ recipient: fakerFromSchema(certificateRecipientSchema)({ sent: faker.date.recent().toISOString() }) })
  expect(screen.queryByText(/intyget har redan skickats och kan inte skickas igen/i)).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Skicka intyg' }))
  expect(screen.getByText(/intyget har redan skickats och kan inte skickas igen/i)).toBeInTheDocument()
})

it('Should navigate to /skicka when pressing send button', async () => {
  renderComponent({ recipient: fakerFromSchema(certificateRecipientSchema)({ sent: null }) })
  await userEvent.click(screen.getByRole('button', { name: 'Skicka intyg' }))
  expect(screen.getByText(/send page/i)).toBeInTheDocument()
})