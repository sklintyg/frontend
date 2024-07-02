import { Link } from 'react-router-dom'
import type { CertificateStatus} from '../../../../schema/certificate.schema';
import { CertificateStatusEnum } from '../../../../schema/certificate.schema'
import { CertificateStatusBadge } from '../CertificateStatusBadge'

export function CertificateCardHeading({ title, id, statuses }: { title: string; id: string; statuses: CertificateStatus[] }) {
  return (
    <div className="mb-2.5 flex flex-col justify-between gap-2.5 md:flex-row">
      <h3 className="ids-heading-2 mb-0">
        <Link to={`/${id}`} className="ids-anchor">
          {title}
        </Link>
      </h3>
      <div className="flex gap-1 [&:not(:last-child)]:mb-2.5">
        {[...new Set(statuses)]
          .sort((status) => (status === CertificateStatusEnum.enum.NEW ? -1 : 1))
          .map((status) => (
            <CertificateStatusBadge key={status} status={status} />
          ))}
      </div>
    </div>
  )
}
