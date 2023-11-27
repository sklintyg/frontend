import { useFormat } from '../../../hooks/useFormat'
import { CertificateMetadata } from '../../../schema/certificate.schema'

export function CertificateInformation({ issued, issuer, summary, unit }: CertificateMetadata) {
  const { date } = useFormat()
  return (
    <div className="flex flex-col gap-5 md:flex-row md:gap-10">
      {summary && (
        <div>
          <h3 className="ids-heading-4 mb-0">{summary.label}</h3>
          {summary.value}
        </div>
      )}
      <div>
        <h3 className="ids-heading-4 mb-0 whitespace-nowrap">Intyg utfärdat</h3>
        {date(issued)}
      </div>
      <div>
        <h3 className="ids-heading-4 mb-0">Skrivet av</h3>
        {issuer.name}, {unit.name}
      </div>
    </div>
  )
}
