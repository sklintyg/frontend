import { useFormat } from '../../../hooks/useFormat'
import { CertificateMetadata } from '../../../schema/certificate.schema'

export function CertificateInformation({ issued, issuer, summary }: CertificateMetadata) {
  const { date } = useFormat()
  return (
    <div className="flex flex-col gap-5 md:flex-row md:gap-10">
      <div>
        <strong className="block">Intyg utfärdat</strong>
        {date(issued)}
      </div>
      {summary && (
        <div>
          <strong className="block">{summary.label}</strong>
          {summary.value}
        </div>
      )}
      <div>
        <strong className="block">Skrivet av</strong>
        {issuer.name}
      </div>
    </div>
  )
}
