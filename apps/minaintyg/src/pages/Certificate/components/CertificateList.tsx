import { Heading } from '@frontend/components'
import type { SortDirection } from 'react-stately'
import type { CertificateMetadata } from '../../../schema/certificate.schema'
import { useGroupCertificateByYear } from '../hooks/useGroupCertificateByYear'
import { CertificateCard } from './CertificateCard/CertificateCard'

export function CertificateList({ certificates, order = 'descending' }: { certificates: CertificateMetadata[]; order?: SortDirection }) {
  const groups = useGroupCertificateByYear(certificates, order)

  return (
    <>
      {groups.map(([year, list]) => (
        <div key={year} className="[&:not(:last-child)]:mb-10" data-testid={`${year}-certificates`}>
          <Heading level={2} size="m" className="mb-5">
            {year}
          </Heading>
          {list.map((certificate) => (
            <CertificateCard key={certificate.id} {...certificate} />
          ))}
        </div>
      ))}
    </>
  )
}
