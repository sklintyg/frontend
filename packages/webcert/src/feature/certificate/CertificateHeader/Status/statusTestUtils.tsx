import {
  CertificateEvent,
  CertificateEventType,
  CertificateMetadata,
  CertificateRelationType,
  CertificateStatus,
} from '@frontend/common/src'

export const createCertificateMetadata = (status: CertificateStatus): CertificateMetadata => {
  return {
    status: status,
    type: 'lisjp',
    relations: {
      children: [],
    },
  }
}

export const createCertificateMetadataWithReplacedOption = (
  status: CertificateStatus,
  includeReplacedRelation: boolean,
  childStatus: CertificateStatus,
  sent?: boolean
): CertificateMetadata => {
  return {
    status: status,
    sent: sent ? sent : false,
    type: 'lisjp',
    relations: {
      children: includeReplacedRelation
        ? [
            {
              type: CertificateRelationType.REPLACED,
              status: childStatus,
              certificateId: 'certificateId',
              created: 'created',
            },
          ]
        : [],
    },
  }
}

export const createHistoryEntriesWithComplementEvent = (status: CertificateStatus): CertificateEvent[] => {
  return [
    {
      certificateId: 'certificateId',
      type: CertificateEventType.COMPLEMENTED,
      timestamp: 'timestamp',
      relatedCertificateId: 'relatedId',
      relatedCertificateStatus: status,
    },
  ]
}
