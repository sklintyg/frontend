import { Certificate } from '../../types/certificate'
import { fakeCertificateData } from './fakeCertificateData'
import { fakeCertificateMetaData } from './fakeCertificateMetaData'

export const fakeCertificate = (data?: Partial<Certificate>): Certificate => ({
  metadata: data?.metadata ?? fakeCertificateMetaData(),
  data: data?.data ?? fakeCertificateData([]),
  links: data?.links ?? [],
})
