import { CertificateIssuer, CertificateUnit } from '../../../../schema/certificate.schema'

export function CertificateCardInfo({ issuer, unit }: { issuer: CertificateIssuer; unit: CertificateUnit }) {
  return (
    <div className="mb-2.5 border-b pb-5 md:flex-row md:border-0 md:pb-0">
      <div>
        <p className="font-bold after:content-[':'] md:after:content-['']">Utfärdare</p>
        <p>
          {issuer.name}, {unit.name}
        </p>
      </div>
    </div>
  )
}
