import type { CertificateIssuer, CertificateUnit } from '../../../../schema/certificate.schema'

export function CertificateCardInfo({ issuer, unit }: { issuer: CertificateIssuer; unit: CertificateUnit }) {
  return (
    <div className="mb-2.5 border-b border-stone-line pb-5 md:flex-row md:border-0 md:pb-0">
      <div>
        <h4 className="ids-heading-4 mb-0">Skrivet av</h4>
        <p>
          {issuer.name}, {unit.name}
        </p>
      </div>
    </div>
  )
}
