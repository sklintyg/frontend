import { Certificate } from '../../types/certificate'
import { fakeCertificateMetaData } from './fakeCertificateMetaData'

export const fakeCertificate = (data?: Partial<Certificate>): Certificate => ({
  metadata: data?.metadata ?? fakeCertificateMetaData(),
  data: data?.data ?? {},
  links: data?.links ?? [],
})
