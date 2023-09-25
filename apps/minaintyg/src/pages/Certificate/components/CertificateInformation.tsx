import { IDSCard } from '@frontend/ids-react-ts'
import { useFormat } from '../../../hooks/useFormat'
import { CertificateMetadata } from '../../../schema/certificate.schema'
import { CertificateEventsInfo } from './CertificateEventsInfo/CertificateEventsInfo'

export function CertificateInformation({ id, issued, issuer, events }: CertificateMetadata) {
  const { date } = useFormat()
  return (
    <IDSCard className="mb-4">
      <h2 className="ids-heading-3">Information om intyget</h2>
      <div className="flex flex-col gap-4 md:grid md:grid-flow-col md:grid-rows-2">
        <div>
          <p className="font-bold">Intyg utfärdat</p>
          {date(issued)}
        </div>

        <div>
          <p className="font-bold">Intygsperiod</p>
        </div>

        <div>
          <p className="font-bold">Utfärdat av</p>
          {issuer.name}
        </div>

        <div>
          <p className="font-bold">Intygs-ID</p>
          {id}
        </div>

        <div className="row-span-2">
          <CertificateEventsInfo events={events} />
        </div>
      </div>
    </IDSCard>
  )
}
