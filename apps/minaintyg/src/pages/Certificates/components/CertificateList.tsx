import { SortDirection } from 'react-stately'
import { CertificateListItem } from '../../../schema/certificateList.schema'
import { useGroupCertificateByYear } from '../hooks/useGroupCertificateByYear'
import { CertificateCard } from './CertificateCard/CertificateCard'

export function CertificateList({ certificates, order = 'descending' }: { certificates: CertificateListItem[]; order?: SortDirection }) {
  const groups = useGroupCertificateByYear(certificates, order)

  return (
    <>
      {groups.map(([year, list]) => (
        <div key={year} className="[&:not(:last-child)]:mb-10" data-testid={`${year}-certificates`}>
          <h2 className="ids-heading-2 mb-5">{year}</h2>
          {list.map((certificate) => (
            <CertificateCard key={certificate.certificateId} {...certificate} />
          ))}
        </div>
      ))}
    </>
  )
}
