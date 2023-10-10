import { fakerFromSchema } from '@frontend/fake'
import { render } from '@testing-library/react'
import { certificateIssuerSchema, certificateUnitSchema } from '../../../../schema/certificate.schema'
import { CertificateCardInfo } from './CertificateCardInfo'

it('Should render correctly', () => {
  const { baseElement } = render(
    <CertificateCardInfo
      id="1234"
      issuer={fakerFromSchema(certificateIssuerSchema)({ name: 'Adamn' })}
      unit={fakerFromSchema(certificateUnitSchema)({ name: 'Alfa-enheten' })}
    />
  )
  expect(baseElement).toMatchSnapshot()
})
