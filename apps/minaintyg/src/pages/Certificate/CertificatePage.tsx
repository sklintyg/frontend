import { skipToken } from '@reduxjs/toolkit/query'
import ReactHtmlParser from 'react-html-parser'
import { useParams } from 'react-router-dom'
import { useGetCertificateQuery } from '../../store/api'

export function CertificatePage() {
  const { id } = useParams()
  const { data: certificate } = useGetCertificateQuery(id ? { id } : skipToken)

  return (
    <>
      <h1 className="ids-heading-1">Läkarintyg för sjukpenning</h1>
      {certificate && <div>{ReactHtmlParser(certificate.content)}</div>}
    </>
  )
}
