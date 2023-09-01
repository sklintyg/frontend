import { CertificateStatus } from '../../../../schema/certificateList.schema'
import { CertificateStatusBadge } from '../CertificateStatusBadge'

export function CertificateCardHeading({ title, id, status }: { title: string; id: string; status: CertificateStatus }) {
  return (
    <div className="mb-2.5 flex flex-col justify-between gap-2.5 md:flex-row">
      <h3 className="ids-heading-2 mb-0">
        <a href={`/intyg/${id}`} className="ids-anchor">
          {title}
        </a>
      </h3>
      <CertificateStatusBadge status={status} />
    </div>
  )
}
