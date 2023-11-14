import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useGetCertificateQuery } from '../../store/api'

export function CertificateCrumb({ id }: { id: string }) {
  const { data: certificateResponse } = useGetCertificateQuery(id ? { id } : skipToken)
  return certificateResponse && certificateResponse.certificate ? <>{certificateResponse.certificate.metadata.type.name}</> : null
}
