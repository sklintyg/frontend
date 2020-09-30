import { RootState } from '../store'
import { createSelector } from '@reduxjs/toolkit'
import { Certificate, CertificateDataElement, CertificateStatus } from '@frontend/common'

export const getIsShowSpinner = (state: RootState) => state.ui.uiCertificate.spinner

export const getSpinnerText = (state: RootState) => state.ui.uiCertificate.spinnerText

export const getIsValidating = (state: RootState) => state.ui.uiCertificate.validationInProgress

export const getIsValidForSigning = (state: RootState) => state.ui.uiCertificate.isValidForSigning

export const getShowValidationErrors = (state: RootState) => state.ui.uiCertificate.showValidationErrors

export const getCertificate = (state: RootState): Certificate => state.ui.uiCertificate.certificate!

export const getQuestion = (id: string) => (state: RootState) => state.ui.uiCertificate.certificate!.data[id]

export const getIsCertificateSigned = () => (state: RootState): boolean => {
  if (!state.ui.uiCertificate.certificate) {
    return false
  }

  return (
    state.ui.uiCertificate.certificate.metadata.certificateStatus === CertificateStatus.SIGNED ||
    state.ui.uiCertificate.certificate.metadata.certificateStatus === CertificateStatus.INVALIDATED
  )
}

export const getUnit = () => (state: RootState) => {
  if (!state.ui.uiCertificate.certificate || !state.ui.uiCertificate.certificate.metadata.unit) {
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
  if (!state.ui.uiCertificate.showValidationErrors) {
    return false
  }

  const question = state.ui.uiCertificate.certificate!.data[id]

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
      component: certificate.data[questionId].config.component,
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

  for (const questionId in certificateData) {
    if (certificateData[questionId].validationErrors && certificateData[questionId].validationErrors.length > 0) {
      // This check makes sure that the category gets selected instead of a question
      // Questions can have questions as parents, but we want to target the categories
      if (certificateData[certificateData[questionId].validation.requiredProp]) {
        result = result.concat(certificateData[certificateData[questionId].validation.requiredProp])
      } else {
        result = result.concat(certificateData[certificateData[questionId].parent])
      }
    }
  }

  result.sort((a, b) => a.index - b.index)

  return result
}
