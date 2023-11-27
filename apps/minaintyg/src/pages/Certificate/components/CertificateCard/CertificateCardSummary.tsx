import { useFormat } from '../../../../hooks/useFormat'
import { CertificateSummary } from '../../../../schema/certificate.schema'

export function CertificateCardSummary({ summary, timestamp }: { summary: CertificateSummary; timestamp: string }) {
  const { date } = useFormat()

  return (
    <div className="mb-2.5 flex flex-col place-content-end gap-2.5 border-stone-line md:mb-5 md:flex-row md:border-b md:pb-5">
      {summary && (
        <div className="grow leading-5">
          <h4 className="ids-heading-4 mb-0 leading-5 md:inline-block md:after:content-[':']">{summary.label}</h4> {summary.value}
        </div>
      )}
      <div className="flex flex-col leading-5 md:flex-row md:gap-1.5 whitespace-nowrap">
        <h4 className="ids-heading-4 mb-0 leading-5 md:inline-block md:after:content-[':']">Intyg utfärdat</h4>
        <span>{date(timestamp)}</span>
      </div>
    </div>
  )
}
