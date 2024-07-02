import type {
  Certificate,
  CertificateEvent,
  CertificateMetadata,
  CertificateRelation,
  Question,
  ResourceLink,
  ResourceLinkType,
} from '../types'
import { CertificateRelationType, CertificateStatus, QuestionType } from '../types'

export const isSigned = (certificateMetadata: CertificateMetadata) => certificateMetadata?.status === CertificateStatus.SIGNED

export const isUnsigned = (certificateMetadata: CertificateMetadata) => certificateMetadata.status === CertificateStatus.UNSIGNED

export const isReplaced = (certificateMetadata: CertificateMetadata) => {
  const {
    relations: { children },
  } = certificateMetadata

  if (children && children.length > 0) {
    return children.some((relation) => relation.type === CertificateRelationType.REPLACED)
  }

  return false
}

export const isRenewedChild = (certificateMetadata: CertificateMetadata) => {
  return (
    (certificateMetadata.relations.parent?.type === CertificateRelationType.EXTENDED ||
      certificateMetadata.relations.parent?.type === CertificateRelationType.RENEW) &&
    certificateMetadata.status !== CertificateStatus.SIGNED
  )
}

export const isReplacedByActiveChild = (certificateMetadata: CertificateMetadata) => {
  const {
    relations: { children },
  } = certificateMetadata

  if (children && children.length > 0) {
    return children.some((relation) => relation.type === CertificateRelationType.REPLACED && relation.status !== CertificateStatus.REVOKED)
  }

  return false
}

export const isLocked = (certificateMetadata: CertificateMetadata) =>
  certificateMetadata.status === CertificateStatus.LOCKED || certificateMetadata.status === CertificateStatus.LOCKED_REVOKED

export const isLockedRevoked = (certificateMetadata: CertificateMetadata) => certificateMetadata.status === CertificateStatus.LOCKED_REVOKED

export const isDraft = (certificateMetadata: CertificateMetadata) => certificateMetadata.status === CertificateStatus.UNSIGNED

export const isDraftSaved = (certificateMetadata: CertificateMetadata, isValidating: boolean) =>
  isDraft(certificateMetadata) && !isValidating

export const isRevoked = (certificateMetadata: CertificateMetadata) =>
  certificateMetadata.status === CertificateStatus.REVOKED || certificateMetadata.status === CertificateStatus.LOCKED_REVOKED

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
  return certificateMetadata.status === CertificateStatus.LOCKED
}

export const isParentLocked = (certificateMetadata: CertificateMetadata) => {
  return (
    certificateMetadata.relations.parent?.status === CertificateStatus.LOCKED ||
    certificateMetadata.relations.parent?.status === CertificateStatus.LOCKED_REVOKED
  )
}

export const getCertificateToSave = (certificate: Certificate): Certificate => {
  const cleanCertificate: Certificate = { ...certificate, data: {} }
  for (const id in certificate.data) {
    if (!certificate.data[id].visible && certificate.data[id].value) {
      cleanCertificate.data[id] = { ...certificate.data[id], value: null }
    } else {
      cleanCertificate.data[id] = certificate.data[id]
    }
  }
  return cleanCertificate
}

export const hasUnhandledComplementQuestions = (questions: Question[]): boolean => {
  return questions.some((question) => question.type === QuestionType.COMPLEMENT && !question.handled)
}

export const getComplementedByCertificateRelation = (certificateMetadata: CertificateMetadata): CertificateRelation | undefined => {
  return certificateMetadata?.relations?.children?.find(
    (r) => r.type === CertificateRelationType.COMPLEMENTED && r.status !== CertificateStatus.REVOKED
  )
}

interface Indexable {
  index: number
}

export const sortByIndex = (a: Indexable, b: Indexable) => a.index - b.index
