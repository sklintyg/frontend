import { fakerFromSchema } from '@frontend/fake'
import { render } from '@testing-library/react'
import { certificateListEventSchema } from '../../../../../schema/certificateList.schema'
import { CertificateCardEvents } from './CertificateCardEvents'

it('Should render correctly', () => {
  const events = [
    fakerFromSchema(certificateListEventSchema, { seed: 1 })({ timestamp: '2023-09-06T11:00:00.000Z' }),
    fakerFromSchema(certificateListEventSchema, { seed: 2 })({ timestamp: '2023-09-05T11:00:00.000Z' }),
    fakerFromSchema(certificateListEventSchema, { seed: 3 })({ timestamp: '2023-09-04T11:00:00.000Z' }),
  ]
  const { baseElement } = render(<CertificateCardEvents events={events} />)
  expect(baseElement).toMatchSnapshot()
})
