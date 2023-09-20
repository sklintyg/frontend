import { useFormat } from '../../../../hooks/useFormat'
import { CertificateListSummary } from '../../../../schema/certificateList.schema'

export function CertificateCardSummary({ summary, timestamp }: { summary: CertificateListSummary; timestamp: string }) {
  const { date } = useFormat()

  return (
    <div className="mb-2.5 flex flex-col place-content-end gap-2.5 md:mb-5 md:flex-row md:border-b md:pb-5">
      {summary && (
        <p className="grow">
          <span className="font-bold">Avser </span>
          <span>
            <span className="font-bold">{summary.label}:</span> {summary.value}
          </span>
        </p>
      )}
      <div className="flex flex-col md:flex-row md:gap-1.5">
        <span className="font-bold">Intyg utfärdat:</span>
        <span>{date(timestamp)}</span>
      </div>
    </div>
  )
}
