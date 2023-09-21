import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { certificateListEventSchema } from '../../../../../schema/certificateList.schema'
import { CertificateCardEventsInfo } from './CertificateCardEventsInfo'

it('Should display header', () => {
  render(<CertificateCardEventsInfo events={Array.from({ length: 3 }, fakerFromSchema(certificateListEventSchema))} />)
  expect(screen.getByText('Senaste händelser')).toBeInTheDocument()
})

it('Should display information when there are no events', () => {
  render(<CertificateCardEventsInfo events={[]} />)
  expect(screen.getByText('Inga händelser')).toBeInTheDocument()
})
