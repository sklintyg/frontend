import { PageDivider } from '../../../components/PageDivider/PageDivider'
import { CertificateMetadata, CertificateUnit } from '../../../schema/certificate.schema'

export function CertificateFooter({ issuer, unit, careUnit }: CertificateMetadata) {
  const buildUnitAddress = (unit: CertificateUnit) => {
    return `${[unit.address, unit.zipCode, unit.city].join(', ')}`
  }
  const buildUnitName = (unit: CertificateUnit, careUnit: CertificateUnit) => {
    if (unit.name === careUnit.name) {
      return unit.name
    }
    return `${[unit.name, careUnit.name].join(', ')}`
  }
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
          <strong>{buildUnitName(unit, careUnit)}</strong>
          <p>{buildUnitAddress(unit)}</p>
        </div>
      </address>
      <PageDivider />
    </footer>
  )
}
