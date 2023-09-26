import { fakerFromSchema } from '@frontend/fake'
import { render } from '@testing-library/react'
import { certificateMetadataSchema } from '../../../schema/certificate.schema'
import { CertificateFooter } from './CertificateFooter'

it('Should render as expected', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    issuer: {
      name: 'Arnold Johansson',
      phoneNumber: '08-123 456 78',
    },
    unit: {
      name: 'Alfa-enheten, Alfamottagningen',
      address: 'Gatuadressens väg 1, 111 11 Storstaden',
    },
  })

  const { baseElement } = render(<CertificateFooter {...metadata} />)
  expect(baseElement).toMatchSnapshot()
})
