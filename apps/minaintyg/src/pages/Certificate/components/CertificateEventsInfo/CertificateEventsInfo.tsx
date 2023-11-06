import { IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useFormat } from '../../../../hooks/useFormat'
import { CertificateEvent } from '../../../../schema/certificate.schema'

export function CertificateEventsInfo({ events }: { events: CertificateEvent[] }) {
  const { datetime } = useFormat()
  return (
    <div>
      <h3 className="ids-heading-4 mb-0">Händelser</h3>
      {events.length === 0 && <span>Inga händelser</span>}
      {events.map(({ timestamp, description, certificateId }) => (
        <div key={timestamp} className="flex flex-col md:flex-row md:gap-2.5">
          <span className="whitespace-nowrap">{datetime(timestamp)}</span>
          {certificateId ? (
            <IDSLink underlined>
              <Link to={`/intyg/${certificateId}`}>{description}</Link>
            </IDSLink>
          ) : (
            <span>{description}</span>
          )}
        </div>
      ))}
    </div>
  )
}
