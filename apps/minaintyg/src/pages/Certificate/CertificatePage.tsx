import { skipToken } from '@reduxjs/toolkit/query'
import ReactHtmlParser from 'react-html-parser'
import { useParams } from 'react-router-dom'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { useGetCertificateQuery } from '../../store/api'
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
          {ReactHtmlParser(certificate.content)}
          <CertificateFooter {...certificate.metadata} />
        </>
      )}
    </>
  )
}
