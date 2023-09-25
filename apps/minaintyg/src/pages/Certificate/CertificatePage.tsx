import { skipToken } from '@reduxjs/toolkit/query'
import ReactHtmlParser from 'react-html-parser'
import { useParams } from 'react-router-dom'
import { useGetCertificateQuery } from '../../store/api'
import { CertificateInformation } from './components/CertificateInformation'
import { CertificateStatusBadge } from './components/CertificateStatusBadge'

export function CertificatePage() {
  const { id } = useParams()
  const { data: certificate } = useGetCertificateQuery(id ? { id } : skipToken)

  return (
    <>
      <h1 className="ids-heading-1 overflow-hidden text-ellipsis">{certificate?.metadata.type.name}</h1>
      {certificate && (
        <>
          <div className="mb-4 flex gap-1">
            {certificate.metadata.statuses.map((status) => (
              <CertificateStatusBadge key={status} status={status} />
            ))}
          </div>
          <CertificateInformation {...certificate.metadata} />
          {ReactHtmlParser(certificate.content)}
        </>
      )}
    </>
  )
}
