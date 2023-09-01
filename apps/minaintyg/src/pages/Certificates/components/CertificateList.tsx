import { getYear, parseISO } from 'date-fns'
import { CertificateListItem } from '../../../schema/certificateList.schema'
import { CertificateCard } from './CertificateCard/CertificateCard'

const getCertificateYear = ({ timestamp }: CertificateListItem) => getYear(parseISO(timestamp))

export function CertificateList({
  certificates,
  order = 'descending',
}: {
  certificates: CertificateListItem[]
  order?: 'ascending' | 'descending'
}) {
  const years = certificates.reduce((result, certificate) => result.add(getCertificateYear(certificate)), new Set<number>())
  return (
    <div>
      {Array.from(years)
        .sort((a, b) => (order === 'ascending' ? a - b : b - a))
        .map((year) => (
          <div key={year} className="[&:not(:last-child)]:mb-10" data-testid={`${year}-certificates`}>
            <h2 className="ids-heading-2 mb-5" key={year}>
              {year}
            </h2>
            {[...certificates]
              .filter((certificate) => getCertificateYear(certificate) === year)
              .sort((a, b) =>
                order === 'ascending'
                  ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                  : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              )
              .map((certificate) => (
                <CertificateCard key={certificate.certificateId} {...certificate} />
              ))}
          </div>
        ))}
    </div>
  )
}
