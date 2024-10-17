import { fakerFromSchema } from 'fake'
import { render } from '@testing-library/react'
import { certificateIssuerSchema, certificateUnitSchema } from '../../../../schema/certificate.schema'
import { CertificateCardInfo } from './CertificateCardInfo'

it('Should render correctly', () => {
  const { container } = render(
    <CertificateCardInfo
      issuer={fakerFromSchema(certificateIssuerSchema)({ name: 'Adamn' })}
      unit={fakerFromSchema(certificateUnitSchema)({ name: 'Alfa-enheten' })}
    />
  )
  expect(container).toMatchSnapshot()
})
