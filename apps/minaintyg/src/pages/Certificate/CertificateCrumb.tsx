import { skipToken } from '@reduxjs/toolkit/query'
import { useGetCertificateQuery } from '../../store/api'

export function CertificateCrumb({ id }: { id: string }) {
  const { data: certificate } = useGetCertificateQuery(id ? { id } : skipToken)
  return certificate ? <>{certificate.metadata.type.name}</> : null
}
