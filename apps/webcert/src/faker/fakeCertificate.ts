import { PartialDeep } from 'type-fest'
import { Certificate, CertificateData } from '../types'
import { fakeCertificateMetaData } from './fakeCertificateMetaData'
import { fakeResourceLink } from './fakeResourceLink'

export const fakeCertificate = (data?: PartialDeep<Certificate> & { data?: CertificateData }): Certificate => ({
  metadata: fakeCertificateMetaData(data?.metadata),
  data: data?.data ?? {},
  links: data?.links?.map(fakeResourceLink) ?? [],
})
