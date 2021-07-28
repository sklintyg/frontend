import { RootState } from '../store'
import { createSelector } from '@reduxjs/toolkit'
import {
  Certificate,
  CertificateDataElement,
  CertificateRelationType,
  CertificateStatus,
  Complement,
  ConfigTypes,
  ResourceLinkType,
} from '@frontend/common'

export const getIsShowSpinner = (state: RootState) => state.ui.uiCertificate.spinner

export const getSpinnerText = (state: RootState) => state.ui.uiCertificate.spinnerText

export const getIsValidating = (state: RootState) => state.ui.uiCertificate.validationInProgress

export const getIsValidForSigning = (state: RootState) => state.ui.uiCertificate.isValidForSigning

export const getShowValidationErrors = (state: RootState) => state.ui.uiCertificate.showValidationErrors

export const getCertificate = (state: RootState): Certificate => state.ui.uiCertificate.certificate!

export const getQuestion = (id: string) => (state: RootState) => state.ui.uiCertificate.certificate!.data[id]

export const getIsComplementingCertificate = (state: RootState): boolean => {
  const metadata = state.ui.uiCertificate.certificate?.metadata
  if (!metadata) {
    return false
  }

  return metadata.relations.parent?.type === CertificateRelationType.COMPLEMENTED && metadata.status === CertificateStatus.UNSIGNED
}

export const getComplements = (questionId: string) => (state: RootState): Complement[] =>
  state.ui.uiCertificate.complements.filter((complement) => complement.questionId === questionId)

export const getGotoId = (state: RootState): string | undefined => {
  const questionId = state.ui.uiCertificate.gotoCertificateDataElement?.questionId
  if (!questionId) {
    return
  }

  return state.ui.uiCertificate.certificate?.data[questionId].parent
}

export const getIsCertificateDeleted = () => (state: RootState) => state.ui.uiCertificate.isDeleted

export const getIsUnsigned = () => (state: RootState): boolean =>
  state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.UNSIGNED

export const getIsSigned = () => (state: RootState) => state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.SIGNED

export const getUnit = () => (state: RootState) => {
  if (!state.ui.uiCertificate.certificate?.metadata.unit) {
    return {
      unitId: '',
      unitName: '',
      address: '',
      zipCode: '',
      city: '',
      phoneNumber: '',
      email: '',
    }
  }

  return state.ui.uiCertificate.certificate.metadata.unit
}

export const getQuestionHasValidationError = (id: string) => (state: RootState) => {
  const {
    ui: {
      uiCertificate: { showValidationErrors, certificate },
    },
  } = state

  if (!showValidationErrors || !certificate || !certificate.data[id].validationErrors) {
    return false
  }

  const question = certificate.data[id]

  return question.validationErrors.length > 0
}

export const getCertificateMetaData = (state: RootState) => {
  const { certificate } = state.ui.uiCertificate
  if (!certificate) {
    return null
  }

  return certificate.metadata
}

export interface CertificateStructure {
  id: string
  component: string
  index: number
}

const certificateStructure: CertificateStructure[] = []
export const getCertificateDataElements = createSelector<RootState, Certificate, CertificateStructure[]>(getCertificate, (certificate) => {
  certificateStructure.length = 0
  if (!certificate) {
    return []
  }

  for (const questionId in certificate.data) {
    certificateStructure.push({
      id: certificate.data[questionId].id,
      component: certificate.data[questionId].config.type,
      index: certificate.data[questionId].index,
    })
  }

  certificateStructure.sort((a, b) => a.index - b.index)
  return certificateStructure
})

export const getAllValidationErrors = () => (state: RootState) => {
  if (!state.ui.uiCertificate.showValidationErrors || !state.ui.uiCertificate.certificate) {
    return []
  }

  const certificateData = state.ui.uiCertificate.certificate.data
  let result: CertificateDataElement[] = []

  //Perhaps this could be simplified
  for (const questionId in certificateData) {
    if (certificateData[questionId].validationErrors && certificateData[questionId].validationErrors.length > 0) {
      if (certificateData[questionId].parent && certificateData[certificateData[questionId].parent].config.type === ConfigTypes.CATEGORY) {
        result = result.concat(certificateData[certificateData[questionId].parent])
      } else {
        let parent = certificateData[questionId].parent
        while (true) {
          if (certificateData[parent].config.type === ConfigTypes.CATEGORY) {
            result = result.concat(certificateData[parent])
            break
          } else if (!certificateData[parent].parent) {
            // if parents parent is not a category and it's null, break to avoid endless loop
            break
          } else {
            parent = certificateData[parent].parent
          }
        }
      }
    }
  }

  result.sort((a, b) => a.index - b.index)

  return result
}

export const getCertificateEvents = (state: RootState) => state.ui.uiCertificate.certificateEvents

export const getResourceLinks = (state: RootState) => state.ui.uiCertificate.certificate?.links ?? []

export const getIsLocked = (state: RootState) =>
  state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.LOCKED ||
  state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.LOCKED_REVOKED

export const getIsEditable = (state: RootState) =>
  state.ui.uiCertificate.certificate?.links.some((link) => link.type === ResourceLinkType.EDIT_CERTIFICATE)
