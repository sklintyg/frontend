import { createReducer } from '@reduxjs/toolkit'
import { Certificate, ConfigTypes } from '@frontend/common'
import {
  enableCertificateDataElement,
  disableCertificateDataElement,
  unhideCertificateDataElement,
  hideCertificateDataElement,
  hideCertificateDataElementMandatory,
  hideSpinner,
  hideValidationErrors,
  setCertificateDataElement,
  setCertificateUnitData,
  setDisabledCertificateDataChild,
  showCertificateDataElement,
  showCertificateDataElementMandatory,
  showSpinner,
  showValidationErrors,
  updateCertificate,
  updateCertificateAsDeleted,
  updateCertificateAsReadOnly,
  updateCertificateEvents,
  updateCertificateStatus,
  updateCertificateVersion,
  updateValidationErrors,
  validateCertificateCompleted,
  validateCertificateStarted,
} from './certificateActions'
import {
  ValueBoolean,
  CertificateDataValueType,
  CertificateDataValidationType,
  ValueText,
  CertificateEvent,
  CertificateDataElement,
  ConfigUeCheckboxMultipleCodes,
  ValueCodeList,
  ValueCode,
} from '@frontend/common'

interface CertificateState {
  certificate?: Certificate
  certificateEvents: CertificateEvent[]
  spinner: boolean
  spinnerText: string
  validationInProgress: boolean
  showValidationErrors: boolean
  isValidForSigning: boolean
  isDeleted: boolean
}

const initialState: CertificateState = {
  certificateEvents: [],
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
      state.isDeleted = false
      state.certificateEvents.splice(0, state.certificateEvents.length)
      for (const questionId in state.certificate.data) {
        const question = state.certificate.data[questionId]
        question.visible = question.visible === undefined ? true : question.visible
        if (question.config.type === ConfigTypes.CATEGORY) {
          continue
        }

        if (question.value) {
          switch (question.value!.type) {
            case CertificateDataValueType.TEXT:
              const textValue = question.value as ValueText
              if (textValue.text === undefined) {
                textValue['text'] = ''
              }
              break
            case CertificateDataValueType.BOOLEAN:
              const booleanValue = question.value as ValueBoolean
              if (booleanValue.selected === undefined) {
                booleanValue['selected'] = null
              }
          }
        }
      }
    })
    .addCase(updateCertificateEvents, (state, action) => {
      state.certificateEvents.splice(0, state.certificateEvents.length)
      state.certificateEvents.push(...action.payload)
    })
    .addCase(updateCertificateStatus, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.status = action.payload
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
        if (question.config.type === ConfigTypes.CATEGORY) {
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

      state.certificate!.data[action.payload].visible = true
    })
    .addCase(hideCertificateDataElement, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate!.data[action.payload].visible = false
    })
    .addCase(unhideCertificateDataElement, (state, action) => {
      if (!state.certificate) {
        return
      }
      if (!state.certificate!.data[action.payload].validation.some((v) => v.type === CertificateDataValidationType.SHOW_VALIDATION)) {
        state.certificate!.data[action.payload].visible = true
      }
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
    .addCase(enableCertificateDataElement, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.data[action.payload].disabled = false
    })
    .addCase(disableCertificateDataElement, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.data[action.payload].disabled = true
      ;(state.certificate.data[action.payload].value as ValueCode).id = ''
      ;(state.certificate.data[action.payload].value as ValueCode).code = ''
    })
    .addCase(updateCertificateAsDeleted, (state) => {
      state.certificate = undefined
      state.isDeleted = true
    })
    .addCase(setDisabledCertificateDataChild, (state, action) => {
      if (!state.certificate || !action.payload.affectedIds) {
        return
      }

      const question = state.certificate.data[action.payload.id] as CertificateDataElement
      const updatedList = (question.config as ConfigUeCheckboxMultipleCodes).list.map((item, i) => {
        const isAffected = action.payload.affectedIds!.some((id: string) => item.id === id)
        if (isAffected) {
          item.disabled = action.payload.result
          if (item.disabled) {
            const index = (state.certificate!.data[action.payload.id].value as ValueCodeList).list.findIndex(
              (value) => item.id === value.id
            )
            if (index !== -1) {
              ;(state.certificate!.data[action.payload.id].value as ValueCodeList).list.splice(index, 1)
            }
          }
        }
        return item
      })
      state.certificate.data[action.payload.id].config.list = updatedList
    })
)

export default certificateReducer
