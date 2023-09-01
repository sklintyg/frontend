import { useFormat } from '../../../../hooks/useFormat'
import { CertificateListEvent } from '../../../../schema/certificateList.schema'

export function CertificateCardEvents({ events }: { events: CertificateListEvent[] }) {
  const { formatDatetime } = useFormat()
  return (
    <div>
      <div className="font-bold">
        Senaste händelser (visar {events.length} av {events.length} händelser)
      </div>
      {events.map(({ timestamp, description }) => (
        <div key={timestamp}>
          {formatDatetime(timestamp)} {description}
        </div>
      ))}
    </div>
  )
}
