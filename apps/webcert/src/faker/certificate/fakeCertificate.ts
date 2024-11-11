import type { Certificate, CertificateData } from '../../types'
import { fakeResourceLink } from '../fakeResourceLink'
import { fakeCertificateMetaData } from './fakeCertificateMetaData'

export const fakeCertificate = (data?: Partial<Certificate> & { data?: CertificateData }): Certificate => ({
  metadata: fakeCertificateMetaData(data?.metadata),
  data: data?.data ?? {},
  links: data?.links?.map(fakeResourceLink) ?? [],
})
