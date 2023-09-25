import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { certificateEventSchema } from '../../../../schema/certificate.schema'
import { CertificateEventsInfo } from './CertificateEventsInfo'

it('Should display header', () => {
  render(<CertificateEventsInfo events={Array.from({ length: 3 }, fakerFromSchema(certificateEventSchema))} />)
  expect(screen.getByText('Senaste händelser')).toBeInTheDocument()
})

it('Should display information when there are no events', () => {
  render(<CertificateEventsInfo events={[]} />)
  expect(screen.getByText('Inga händelser')).toBeInTheDocument()
})
