import { CertificateMetadata, CertificateRelationType, CertificateStatus } from '@frontend/common/src'

export const createCertificateMetadata = (status: CertificateStatus, isSent: boolean, type?: string): CertificateMetadata => {
  return {
    status: status,
    sent: isSent,
    type: type ? type : 'lisjp',
    relations: {
      children: [],
    },
  }
}

export const createCertificateMetadataWithParentRelation = (
  status: CertificateStatus,
  parentStatus: CertificateStatus,
  type: CertificateRelationType,
  sent?: boolean
): CertificateMetadata => {
  // @ts-ignore
  return {
    status: status,
    sent: sent ? sent : false,
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
  }
}

export const createCertificateMetadataWithChildRelation = (
  status: CertificateStatus,
  childStatus: CertificateStatus,
  type: CertificateRelationType,
  sent?: boolean
): CertificateMetadata => {
  // @ts-ignore
  return {
    status: status,
    sent: sent ? sent : false,
    type: 'lisjp',
    relations: {
      children: [
        {
          type: type,
          status: childStatus,
          certificateId: 'certificateId',
          created: 'created',
        },
      ],
    },
  }
}
