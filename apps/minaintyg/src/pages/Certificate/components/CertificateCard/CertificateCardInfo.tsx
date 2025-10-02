import { Heading } from '@frontend/components'
import type { CertificateIssuer, CertificateUnit } from '../../../../schema/certificate.schema'

export function CertificateCardInfo({ issuer, unit }: { issuer: CertificateIssuer; unit: CertificateUnit }) {
  return (
    <div className="mb-2.5 border-b border-neutral-90 pb-5 md:flex-row md:border-0 md:pb-0">
      <div>
        <Heading level={4} size="xs" className="mb-0">
          Skrivet av
        </Heading>
        <p>
          {issuer.name}, {unit.name}
        </p>
      </div>
    </div>
  )
}
