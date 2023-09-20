import { IDSButton, IDSCard } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { CertificateListItem } from '../../../../schema/certificateList.schema'
import { CertificateCardEvents } from './CertificateCardEvents/CertificateCardEvents'
import { CertificateCardHeading } from './CertificateCardHeading'
import { CertificateCardInfo } from './CertificateCardInfo'
import { CertificateCardSummary } from './CertificateCardSummary'

export function CertificateCard({ certificateId, type, summary, issuer, issued, statuses, events }: CertificateListItem) {
  const navigate = useNavigate()

  return (
    <IDSCard className="[&:not(:last-child)]:mb-5">
      <CertificateCardHeading title={type.name} id={certificateId} statuses={statuses} />
      <CertificateCardSummary summary={summary} timestamp={issued} />
      <CertificateCardInfo issuer={issuer} id={certificateId} />

      <div className="flex flex-col justify-between gap-2.5 md:flex-row">
        <CertificateCardEvents events={events} />
        <IDSButton role="button" sblock onClick={() => navigate(`/intyg/${certificateId}`)} className="md:self-end" secondary>
          Visa intyg
        </IDSButton>
      </div>
    </IDSCard>
  )
}
