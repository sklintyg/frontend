import { Heading } from '@frontend/components'
import { IDSButton, IDSCard } from '@inera/ids-react'
import { useNavigate } from 'react-router-dom'
import type { CertificateMetadata } from '../../../../schema/certificate.schema'
import { CertificateCardEvents } from './CertificateCardEvents/CertificateCardEvents'
import { CertificateCardHeading } from './CertificateCardHeading'
import { CertificateCardInfo } from './CertificateCardInfo'
import { CertificateCardSummary } from './CertificateCardSummary'

export function CertificateCard({ id, type, summary, issuer, issued, statuses, events, unit }: CertificateMetadata) {
  const navigate = useNavigate()

  return (
    <div className="[&:not(:last-child)]:mb-5">
      <IDSCard>
        <CertificateCardHeading title={type.name} id={id} statuses={statuses} />
        <CertificateCardSummary summary={summary} timestamp={issued} />
        <CertificateCardInfo issuer={issuer} unit={unit} />

        <div className="flex flex-col justify-between gap-2.5 md:flex-row">
          <CertificateCardEvents
            events={events}
            heading={
              <Heading level={5} size="xs" className="mb-0">
                Händelser
              </Heading>
            }
          />
          <IDSButton role="button" sBlock onClick={() => navigate(`/${id}`)} className="md:self-end">
            Visa intyg
          </IDSButton>
        </div>
      </IDSCard>
    </div>
  )
}
