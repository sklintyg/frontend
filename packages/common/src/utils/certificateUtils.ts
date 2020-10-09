import { CertificateEvent, CertificateMetadata, CertificateStatus, CertificateEventType } from '..'

export const isSigned = (certificateMetadata: CertificateMetadata) => certificateMetadata.certificateStatus === CertificateStatus.SIGNED

export const isUnsigned = (certificateMetadata: CertificateMetadata) => certificateMetadata.certificateStatus === CertificateStatus.UNSIGNED

export const isReplaced = (certificateMetadata: CertificateMetadata) => {
  const {
    relations: { children },
  } = certificateMetadata

  if (children && children.length > 0) {
    return true
  }

  return false
}

export const isDraftSaved = (certificateMetadata: CertificateMetadata, isValidating: boolean) =>
  certificateMetadata.certificateStatus === CertificateStatus.UNSIGNED && !isValidating

export const isRevoked = (certificateMetadata: CertificateMetadata) =>
  certificateMetadata.certificateStatus == CertificateStatus.INVALIDATED

export const isReplacingCertificateRevoked = (historyEntries: CertificateEvent[]) => {
  return historyEntries.some((entry) => entry.relatedCertificateStatus === CertificateStatus.INVALIDATED)
}
