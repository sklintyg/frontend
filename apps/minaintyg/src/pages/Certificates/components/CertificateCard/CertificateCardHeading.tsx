import { Link } from 'react-router-dom'
import { CertificateStatusBadge } from '../CertificateStatusBadge'

export function CertificateCardHeading({ title, id, statuses }: { title: string; id: string; statuses: CertificateStatus[] }) {
  return (
    <div className="mb-2.5 flex flex-col justify-between gap-2.5 md:flex-row">
      <h3 className="ids-heading-2 mb-0">
        <Link to={`/intyg/${id}`} className="ids-anchor">
          {title}
        </Link>
      </h3>
      <div className="flex gap-1 [&:not(:last-child)]:mb-2.5">
        {[...new Set(statuses)].map((status) => (
          <CertificateStatusBadge key={status} status={status} />
        ))}
      </div>
    </div>
  )
}
