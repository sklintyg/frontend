import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { certificateListEventSchema } from '../../../../schema/certificateList.schema'
import { CertificateCardEvents } from './CertificateCardEvents'

it('Should display number of shown events', () => {
  const events = Array.from({ length: 3 }, fakerFromSchema(certificateListEventSchema))
  render(<CertificateCardEvents events={events} />)
  expect(screen.getAllByText('Senaste händelser (visar 3 av 3 händelser)')).toHaveLength(2)
})
