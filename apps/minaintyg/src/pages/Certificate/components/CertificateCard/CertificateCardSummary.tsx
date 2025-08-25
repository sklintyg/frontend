import { Heading } from '@frontend/components'
import { useFormat } from '../../../../hooks/useFormat'
import type { CertificateSummary } from '../../../../schema/certificate.schema'

export function CertificateCardSummary({ summary, timestamp }: { summary: CertificateSummary; timestamp: string }) {
  const { date } = useFormat()

  return (
    <div className="mb-2.5 flex flex-col place-content-end gap-2.5 border-neutral-90 md:mb-5 md:flex-row md:border-b md:pb-5">
      {summary && (
        <div className="grow leading-5">
          <Heading level={4} size="xs" className="mb-0 leading-5 md:inline-block md:after:content-[':']">
            {summary.label}
          </Heading>{' '}
          {summary.value}
        </div>
      )}
      <div className="flex flex-col whitespace-nowrap leading-5 md:flex-row md:gap-1.5">
        <Heading level={4} size="xs" className="mb-0 leading-5 md:inline-block md:after:content-[':']">
          Intyg utfärdat
        </Heading>
        <span>{date(timestamp)}</span>
      </div>
    </div>
  )
}
