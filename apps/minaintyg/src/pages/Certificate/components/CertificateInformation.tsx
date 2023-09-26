import { IDSCard } from '@frontend/ids-react-ts'
import { useFormat } from '../../../hooks/useFormat'
import { CertificateMetadata } from '../../../schema/certificate.schema'
import { CertificateEventsInfo } from './CertificateEventsInfo/CertificateEventsInfo'

export function CertificateInformation({ id, issued, issuer, events, summary }: CertificateMetadata) {
  const { date } = useFormat()
  return (
    <IDSCard className="mb-4">
      <h2 className="ids-heading-3">Information om intyget</h2>
      <div className="flex flex-col gap-4 md:grid md:grid-flow-col md:grid-rows-2">
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
          <strong className="block">Utfärdat av</strong>
          {issuer.name}
        </div>

        <div>
          <strong className="block">Intygs-ID</strong>
          {id}
        </div>

        <div className="row-span-2">
          <CertificateEventsInfo events={events} />
        </div>
      </div>
    </IDSCard>
  )
}
