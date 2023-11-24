import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { certificateRecipientSchema } from '../../../../schema/certificate.schema'
import { CertificateSentDialog } from './CertificateSentDialog'

it('Should render the expected message', () => {
  render(
    <CertificateSentDialog
      recipient={fakerFromSchema(certificateRecipientSchema)({ name: 'Dr. Lina Lindholm V', sent: '2023-10-23T06:40:00.000Z' })}
      open
      onOpenChange={vi.fn()}
    />
  )
  expect(
    screen.getByText(/intyget har redan skickats och kan inte skickas igen. dr. lina lindholm v tog emot intyget 2023-10-23/i)
  ).toBeInTheDocument()
})
