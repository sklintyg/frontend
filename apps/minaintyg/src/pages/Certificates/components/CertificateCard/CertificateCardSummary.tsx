import { useFormat } from '../../../../hooks/useFormat'
import { CertificateListSummary } from '../../../../schema/certificateList.schema'

export function CertificateCardSummary({ summary, timestamp }: { summary: CertificateListSummary; timestamp: string }) {
  const { formatDate } = useFormat()

  return (
    <div className="mb-2.5 flex flex-col place-content-end gap-2.5 md:mb-5 md:flex-row md:border-b md:pb-5">
      {summary.length > 0 && (
        <p className="grow">
          <span className="font-bold">Avser </span>
          {summary.map(([description, value]) => (
            <>
              <span className="font-bold">{description}:</span> {value}{' '}
            </>
          ))}
        </p>
      )}
      <div className="flex flex-col md:flex-row md:gap-1.5">
        <span className="font-bold">Intyg utfärdat:</span>
        <span>{formatDate(timestamp)}</span>
      </div>
    </div>
  )
}
