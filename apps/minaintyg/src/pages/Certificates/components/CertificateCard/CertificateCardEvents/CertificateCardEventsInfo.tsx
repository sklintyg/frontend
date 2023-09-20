import { useFormat } from '../../../../../hooks/useFormat'
import { CertificateListEvent } from '../../../../../schema/certificateList.schema'

export function CertificateCardEventsInfo({ events }: { events: CertificateListEvent[] }) {
  const { datetime } = useFormat()
  return (
    <div>
      <div className="font-bold">Senaste händelser</div>
      {events.length === 0 && <span>Inga händelser</span>}
      {events.map(({ timestamp, description }) => (
        <div key={timestamp}>
          {datetime(timestamp)} {description}
        </div>
      ))}
    </div>
  )
}
