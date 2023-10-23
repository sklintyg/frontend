import { useFormat } from '../../../../hooks/useFormat'
import { CertificateEvent } from '../../../../schema/certificate.schema'

export function CertificateEventsInfo({ events }: { events: CertificateEvent[] }) {
  const { datetime } = useFormat()
  return (
    <div>
      <div className="font-bold">Senaste händelser</div>
      {events.length === 0 && <span>Inga händelser</span>}
      {events.map(({ timestamp, description }) => (
        <div key={timestamp} className="flex flex-col md:flex-row md:gap-1">
          <span className="whitespace-nowrap">{datetime(timestamp)}:</span>
          <span>{description}</span>
        </div>
      ))}
    </div>
  )
}
