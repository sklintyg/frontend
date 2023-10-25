import { PageDivider } from '../../../components/PageDivider/PageDivider'
import { CertificateMetadata } from '../../../schema/certificate.schema'

export function CertificateFooter({ issuer, unit, careUnit }: CertificateMetadata) {
  const unitName = unit.name === careUnit.name ? unit.name : [unit.name, careUnit.name].join(', ')
  const unitAddress = [unit.address, unit.zipCode, unit.city].join(', ')
  return (
    <footer>
      <PageDivider />
      <h2 className="ids-heading-3">Intyget är utfärdat och signerat av</h2>
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
    </footer>
  )
}