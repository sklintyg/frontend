import { IDSButton, IDSCard } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { CertificateMetadata } from '../../../../schema/certificate.schema'
import { CertificateCardEvents } from './CertificateCardEvents/CertificateCardEvents'
import { CertificateCardHeading } from './CertificateCardHeading'
import { CertificateCardInfo } from './CertificateCardInfo'
import { CertificateCardSummary } from './CertificateCardSummary'

export function CertificateCard({ id, type, summary, issuer, issued, statuses, events }: CertificateMetadata) {
  const navigate = useNavigate()

  return (
    <IDSCard className="[&:not(:last-child)]:mb-5">
      <CertificateCardHeading title={type.name} id={id} statuses={statuses} />
      <CertificateCardSummary summary={summary} timestamp={issued} />
      <CertificateCardInfo issuer={issuer} id={id} />

      <div className="flex flex-col justify-between gap-2.5 md:flex-row">
        <CertificateCardEvents events={events} />
        <IDSButton role="button" sblock onClick={() => navigate(`/intyg/${id}`)} className="md:self-end" secondary>
          Visa intyg
        </IDSButton>
      </div>
    </IDSCard>
  )
}
