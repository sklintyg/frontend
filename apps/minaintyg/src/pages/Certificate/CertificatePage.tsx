import { skipToken } from '@reduxjs/toolkit/query'
import { useParams } from 'react-router-dom'
import { PageDivider } from '../../components/PageDivider/PageDivider'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { useGetCertificateQuery } from '../../store/api'
import { CertificateBody } from './components/CertificateBody/CertificateBody'
import { CertificateFooter } from './components/CertificateFooter'
import { CertificateInformation } from './components/CertificateInformation'
import { CertificateStatusBadge } from './components/CertificateStatusBadge'

export function CertificatePage() {
  const { id } = useParams()
  const { data: certificate } = useGetCertificateQuery(id ? { id } : skipToken)

  return (
    <>
      <PageHeading heading={certificate?.metadata.type.name} />
      {certificate && (
        <>
          <div className="mb-4 flex gap-1">
            {certificate.metadata.statuses.map((status) => (
              <CertificateStatusBadge key={status} status={status} />
            ))}
          </div>
          <CertificateInformation {...certificate.metadata} />
          <PageDivider />
          <article className="ids-certificate">
            <CertificateBody content={certificate.content} />
            <CertificateFooter {...certificate.metadata} />
          </article>
        </>
      )}
    </>
  )
}
