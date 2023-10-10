import { fakerFromSchema } from '@frontend/fake'
import { render } from '@testing-library/react'
import { certificateEventSchema } from '../../../../../schema/certificate.schema'
import { CertificateCardEvents } from './CertificateCardEvents'

it('Should render correctly', () => {
  const events = [
    fakerFromSchema(certificateEventSchema, { seed: 1 })({ timestamp: '2023-09-06T11:00:00.000Z' }),
    fakerFromSchema(certificateEventSchema, { seed: 2 })({ timestamp: '2023-09-05T11:00:00.000Z' }),
    fakerFromSchema(certificateEventSchema, { seed: 3 })({ timestamp: '2023-09-04T11:00:00.000Z' }),
  ]
  const { container } = render(<CertificateCardEvents events={events} />)
  expect(container).toMatchSnapshot()
})
