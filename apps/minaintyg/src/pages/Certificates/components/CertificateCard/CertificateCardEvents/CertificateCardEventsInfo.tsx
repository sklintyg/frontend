import { useFormat } from '../../../../../hooks/useFormat'
import { CertificateListEvent } from '../../../../../schema/certificateList.schema'

export function CertificateCardEventsInfo({ events }: { events: CertificateListEvent[] }) {
  const { datetime } = useFormat()
  return (
    <div>
      <div className="font-bold">
        Senaste händelser (visar {events.length} av {events.length} händelser)
      </div>
      {events.map(({ timestamp, description }) => (
        <div key={timestamp}>
          {datetime(timestamp)} {description}
        </div>
      ))}
    </div>
  )
}
