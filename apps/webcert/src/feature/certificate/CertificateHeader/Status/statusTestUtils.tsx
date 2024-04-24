import { fakeCertificateMetaData } from '../../../../faker'
import { CertificateMetadata, CertificateRelationType, CertificateStatus } from '../../../../types'

// export const createCertificateMetadata = (status: CertificateStatus, isSent: boolean, type?: string): CertificateMetadata => {
//   return fakeCertificateMetaData({
//     status: status,
//     sent: isSent,
//     sentTo: isSent ? 'Försäkringskassan' : undefined,
//     type: type ? type : 'lisjp',
//     relations: {
//       parent: null,
//       children: [],
//     },
//   })
// }

export const createCertificateMetadataWithParentRelation = (
  status: CertificateStatus,
  parentStatus: CertificateStatus,
  type: CertificateRelationType,
  sent?: boolean
): CertificateMetadata => {
  return fakeCertificateMetaData({
    status: status,
    sent: sent ? sent : false,
    sentTo: sent ? 'Försäkringskassan' : undefined,
    type: 'lisjp',
    relations: {
      parent: {
        type: type,
        status: parentStatus,
        certificateId: 'certificateId',
        created: 'created',
      },
      children: [],
    },
  })
}

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
