import { fakeCertificateMetaData } from '../../../../faker'
import { CertificateMetadata, CertificateRelationType, CertificateStatus } from '../../../../types'

export const createCertificateMetadataWithChildRelation = (
  status: CertificateStatus,
  childStatus: CertificateStatus,
  type: CertificateRelationType,
  sent?: boolean
): CertificateMetadata => {
  return fakeCertificateMetaData({
    status: status,
    sent: sent ? sent : false,
    sentTo: sent ? 'Försäkringskassan' : undefined,
    type: 'lisjp',
    relations: {
      parent: null,
      children: [
        {
          type: type,
          status: childStatus,
          certificateId: 'certificateId',
          created: 'created',
        },
      ],
    },
  })
}
