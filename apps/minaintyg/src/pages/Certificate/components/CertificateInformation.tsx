import { Heading } from '@frontend/components'
import { useFormat } from '../../../hooks/useFormat'
import type { CertificateMetadata } from '../../../schema/certificate.schema'

export function CertificateInformation({ issued, issuer, summary, unit }: CertificateMetadata) {
  const { date } = useFormat()
  return (
    <div className="flex flex-col gap-5 md:flex-row md:gap-10">
      {summary && (
        <div>
          <Heading level={3} size="xs" className="mb-0">
            {summary.label}
          </Heading>
          {summary.value}
        </div>
      )}
      <div>
        <Heading level={3} size="xs" className="mb-0 whitespace-nowrap">
          Intyg utfärdat
        </Heading>
        {date(issued)}
      </div>
      <div>
        <Heading level={3} size="xs" className="mb-0">
          Skrivet av
        </Heading>
        {issuer.name}, {unit.name}
      </div>
    </div>
  )
}
