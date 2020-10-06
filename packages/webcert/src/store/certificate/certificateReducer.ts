import { createReducer } from '@reduxjs/toolkit'
import { Certificate } from '@frontend/common'
import {
  autoSaveCertificateSuccess,
  hideCertificateDataElement,
  hideCertificateDataElementMandatory,
  hideSpinner,
  hideValidationErrors,
  setCertificateDataElement,
  setCertificateUnitData,
  showCertificateDataElement,
  showCertificateDataElementMandatory,
  showSpinner,
  showValidationErrors,
  updateCertificate,
  updateCertificateAsDeleted,
  updateCertificateAsReadOnly,
  updateCertificateStatus,
  updateCertificateVersion,
  updateValidationErrors,
  validateCertificateCompleted,
  validateCertificateStarted,
} from './certificateActions'
import { CertificateBooleanValue, CertificateDataValueType, CertificateTextValue } from '@frontend/common'

interface CertificateState {
  certificate?: Certificate
  spinner: boolean
  spinnerText: string
  validationInProgress: boolean
  showValidationErrors: boolean
  isValidForSigning: boolean
  isDeleted: boolean
}

const initialState: CertificateState = {
  spinner: false,
  spinnerText: '',
  validationInProgress: false,
  showValidationErrors: false,
  isValidForSigning: false,
  isDeleted: false,
}

const certificateReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateCertificate, (state, action) => {
      state.certificate = action.payload
      for (const questionId in state.certificate.data) {
        const question = state.certificate.data[questionId]
        if (question.config.component === 'category') {
          continue
        }

        switch (question.value.type) {
          case CertificateDataValueType.TEXT:
            const textValue = question.value as CertificateTextValue
            if (textValue.text == undefined) {
              textValue['text'] = ''
            }
            break
          case CertificateDataValueType.BOOLEAN:
            const booleanValue = question.value as CertificateBooleanValue
            if (booleanValue.selected == undefined) {
              booleanValue['selected'] = null
            }
        }
      }
    })
    .addCase(updateCertificateStatus, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.certificateStatus = action.payload
    })
    .addCase(updateCertificateAsReadOnly, (state) => {
      if (!state.certificate) {
        return
      }

      for (const questionId in state.certificate!.data) {
        state.certificate.data[questionId].readOnly = true
      }
    })
    .addCase(setCertificateDataElement, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.data[action.payload.id] = action.payload
    })
    .addCase(setCertificateUnitData, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.unit = action.payload
    })
    .addCase(updateCertificateVersion, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.version = action.payload
    })
    .addCase(showSpinner, (state, action) => {
      state.spinner = true
      state.spinnerText = action.payload
    })
    .addCase(hideSpinner, (state) => {
      state.spinner = false
      state.spinnerText = ''
    })
    .addCase(validateCertificateStarted, (state) => {
      state.validationInProgress = true
    })
    .addCase(validateCertificateCompleted, (state) => {
      state.validationInProgress = false
    })
    .addCase(updateValidationErrors, (state, action) => {
      for (const questionId in state.certificate!.data) {
        const question = state.certificate!.data[questionId]
        if (question.config.component === 'category') {
          continue
        }

        // TODO: Only update validationErrors for questions that have changed.
        question.validationErrors = []
        for (const validationError of action.payload) {
          if (validationError.id === questionId) {
            question.validationErrors.push(validationError)
          }
        }
      }
      state.isValidForSigning = action.payload.length === 0
    })
    .addCase(showValidationErrors, (state) => {
      state.showValidationErrors = true
    })
    .addCase(hideValidationErrors, (state) => {
      state.showValidationErrors = false
    })
    .addCase(showCertificateDataElement, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.data[action.payload].visible = true
    })
    .addCase(hideCertificateDataElement, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.data[action.payload].visible = false
    })
    .addCase(showCertificateDataElementMandatory, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.data[action.payload].mandatory = true
    })
    .addCase(hideCertificateDataElementMandatory, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.data[action.payload].mandatory = false
    })
    .addCase(updateCertificateAsDeleted, (state) => {
      state.certificate = undefined
      state.isDeleted = true
    })
)

export default certificateReducer
