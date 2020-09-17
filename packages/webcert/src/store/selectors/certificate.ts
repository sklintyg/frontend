import { RootState } from '../store'
import { createSelector } from '@reduxjs/toolkit'
import { Certificate, CertificateData } from '@frontend/common'

export const getIsShowSpinner = (state: RootState) => state.ui.uiCertificate.spinner

export const getSpinnerText = (state: RootState) => state.ui.uiCertificate.spinnerText

export const getIsValidating = (state: RootState) => state.ui.uiCertificate.validationInProgress

export const getIsValidForSigning = (state: RootState) => state.ui.uiCertificate.isValidForSigning

export const getShowValidationErrors = (state: RootState) => state.ui.uiCertificate.showValidationErrors

export const getCertificate = (state: RootState): Certificate => state.ui.uiCertificate.certificate!

export const getQuestion = (id: string) => (state: RootState) => state.ui.uiCertificate.certificate!.data[id]

export const getQuestionHasValidationError = (id: string) => (state: RootState) => {
  if (!state.ui.uiCertificate.showValidationErrors) {
    return false
  }

  const question = state.ui.uiCertificate.certificate!.data[id]

  return question.validationErrors.length > 0 && question.visible
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
