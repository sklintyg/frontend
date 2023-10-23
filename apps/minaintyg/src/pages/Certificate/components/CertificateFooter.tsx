import { PageDivider } from '../../../components/PageDivider/PageDivider'
import { CertificateMetadata } from '../../../schema/certificate.schema'

export function CertificateFooter({ issuer, unit }: CertificateMetadata) {
  return (
    <footer>
      <PageDivider />
      <h2 className="ids-heading-3">Intyget är utfärdat och signerat av</h2>
      <address className="flex flex-col gap-4 not-italic md:flex-row md:gap-[6.25rem]">
        <div>
          <strong>{issuer.name}</strong>
          <p>{issuer.phoneNumber}</p>
        </div>
        <div>
          <strong>{unit.name}</strong>
          <p>{unit.address}</p>
        </div>
      </address>
      <PageDivider />
    </footer>
  )
}
