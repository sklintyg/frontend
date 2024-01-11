import { fakerFromSchema } from '@frontend/fake'
import { render } from '@testing-library/react'
import { expect, it } from 'vitest'
import { CertificateCardInfo } from './CertificateCardInfo'
import { certificateIssuerSchema, certificateUnitSchema } from '../../../../schema/certificate.schema'

it('Should render correctly', () => {
  const { container } = render(
    <CertificateCardInfo
      issuer={fakerFromSchema(certificateIssuerSchema)({ name: 'Adamn' })}
      unit={fakerFromSchema(certificateUnitSchema)({ name: 'Alfa-enheten' })}
    />
  )
  expect(container).toMatchSnapshot()
})
