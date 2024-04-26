import { CertificateListItem } from '../../types'

export function fakeCertificateListItem(data?: Partial<CertificateListItem>): CertificateListItem {
  return {
    ...data,
    values: data?.values ?? { id: 'example' },
  }
}
