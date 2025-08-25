import { Heading } from '@frontend/components'
import { isTruthy } from '@frontend/utils/src'
import { PageDivider } from '../../../components/PageDivider/PageDivider'
import type { CertificateMetadata } from '../../../schema/certificate.schema'

export function CertificateFooter({ issuer, unit, careUnit, id }: CertificateMetadata) {
  const unitName = unit.name === careUnit.name ? unit.name : [unit.name, careUnit.name].join(', ')
  const unitAddress = [[unit.address, unit.zipCode].filter(isTruthy).join(', '), unit.city].filter(isTruthy).join(' ')

  return (
    <footer className="pt-7">
      <Heading level={2} size="s">
        Intyget är skrivet av
      </Heading>
      <address className="flex flex-col gap-4 not-italic md:flex-row md:gap-[6.25rem]">
        <div>
          <strong>{issuer.name}</strong>
          <p>{unit.phoneNumber}</p>
        </div>
        <div>
          <strong>{unitName}</strong>
          <p>{unitAddress}</p>
        </div>
      </address>
      <PageDivider />
      <strong>Intygs-ID:</strong> {id}
    </footer>
  )
}
