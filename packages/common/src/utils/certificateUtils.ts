import { ResourceLink } from './../types/resourceLink'
import { CertificateEvent, CertificateMetadata, CertificateStatus, CertificateEventType } from '..'
import { ResourceLinkType } from '../types/resourceLink'

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

export const isLocked = (certificateMetadata: CertificateMetadata) => certificateMetadata.certificateStatus === CertificateStatus.LOCKED ||
certificateMetadata.certificateStatus === CertificateStatus.LOCKED_REVOKED

export const isDraftSaved = (certificateMetadata: CertificateMetadata, isValidating: boolean) =>
  certificateMetadata.certificateStatus === CertificateStatus.UNSIGNED && !isValidating

export const isRevoked = (certificateMetadata: CertificateMetadata) =>
  certificateMetadata.certificateStatus === CertificateStatus.REVOKED ||
  certificateMetadata.certificateStatus === CertificateStatus.LOCKED_REVOKED

export const isReplacingCertificateRevoked = (historyEntries: CertificateEvent[]) => {
  return historyEntries.some((entry) => entry.relatedCertificateStatus === CertificateStatus.REVOKED)
}

export const getReplacedCertificateStatus = (certificateMetadata: CertificateMetadata) => {
  return certificateMetadata.relations.children[0].status
}

export const getReplacedType = (certificateMetadata: CertificateMetadata) => certificateMetadata.relations.children[0].type

export const isParentRevoked = (certificateMetadata: CertificateMetadata) => {
  return (
    certificateMetadata.relations.parent?.status === CertificateStatus.REVOKED ||
    certificateMetadata.relations.parent?.status === CertificateStatus.LOCKED_REVOKED
  )
}

export const isHasParent = (certificateMetadata: CertificateMetadata) => {
  return !!certificateMetadata.relations.parent
}

export const resourceLinksAreEqual = (actual: ResourceLinkType, wanted: ResourceLinkType) => actual === wanted

export const getResourceLink = (resourceLinks: ResourceLink[], wanted: ResourceLinkType): ResourceLink =>
  resourceLinks.find((link) => link.type === wanted)!

export const isDisabled = (certificateMetadata: CertificateMetadata) => {
  return certificateMetadata.certificateStatus === CertificateStatus.LOCKED
}

export const isParentLocked = (certificateMetadata: CertificateMetadata) => {
  return (
    certificateMetadata.relations.parent?.status === CertificateStatus.LOCKED ||
    certificateMetadata.relations.parent?.status === CertificateStatus.LOCKED_REVOKED
  )
}