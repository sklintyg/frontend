import { createReducer } from '@reduxjs/toolkit'
import {
  Certificate,
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateEvent,
  Complement,
  ConfigTypes,
  ConfigUeCheckboxMultipleCodes,
  UnitValidationErrors,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueText,
} from '@frontend/common'
import {
  clearGotoCertificateDataElement,
  disableCertificateDataElement,
  enableCertificateDataElement,
  GotoCertificateDataElement,
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
  unhideCertificateDataElement,
  updateCertificate,
  updateCertificateAsDeleted,
  updateCertificateAsReadOnly,
  updateCertificateComplements,
  updateCertificateEvents,
  updateCertificateStatus,
  updateCertificateVersion,
  updateGotoCertificateDataElement,
  updateValidationErrors,
  validateCertificateCompleted,
  validateCertificateStarted,
  SigningData,
  updateCertificateSigningData,
  highlightCertificateDataElement,
  unstyleCertificateDataElement,
  setReadyForSign,
  updateRoutedFromDeletedCertificate,
  toggleCertificateFunctionDisabler,
} from './certificateActions'
import { CertificateDataElementStyleEnum } from '@frontend/common/src'
import { FunctionDisabler, toggleFunctionDisabler } from '../../components/utils/functionDisablerUtils'

interface CertificateState {
  certificate?: Certificate
  certificateEvents: CertificateEvent[]
  spinner: boolean
  spinnerText: string
  validationInProgress: boolean
  showValidationErrors: boolean
  isValidForSigning: boolean
  isDeleted: boolean
  complements: Complement[]
  gotoCertificateDataElement?: GotoCertificateDataElement
  signingData?: SigningData
  routedFromDeletedCertificate: boolean
  functionDisablers: FunctionDisabler[]
}

const initialState: CertificateState = {
  certificateEvents: [],
  spinner: false,
  spinnerText: '',
  validationInProgress: false,
  showValidationErrors: false,
  isValidForSigning: false,
  isDeleted: false,
  complements: [],
  routedFromDeletedCertificate: false,
  functionDisablers: [],
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

      state.certificate!.metadata.unitValidationErrors = {} as UnitValidationErrors
      for (const validationError of action.payload) {
        if (validationError.category === 'vardenhet' && validationError.field === 'grunddata.skapadAv.vardenhet.postadress') {
          state.certificate!.metadata.unitValidationErrors.addressValidationErrors = []
          state.certificate!.metadata.unitValidationErrors.addressValidationErrors.push(validationError)
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
    .addCase(updateCertificateComplements, (state, action) => {
      state.complements = action.payload
    })
    .addCase(updateGotoCertificateDataElement, (state, action) => {
      state.gotoCertificateDataElement = action.payload
    })
    .addCase(clearGotoCertificateDataElement, (state) => {
      state.gotoCertificateDataElement = undefined
    })
    .addCase(updateCertificateSigningData, (state, action) => {
      state.signingData = action.payload
    })
    .addCase(highlightCertificateDataElement, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.data[action.payload].style = CertificateDataElementStyleEnum.HIGHLIGHTED
    })
    .addCase(unstyleCertificateDataElement, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.data[action.payload].style = CertificateDataElementStyleEnum.NORMAL
    })
    .addCase(setReadyForSign, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.readyForSign = action.payload
    })
    .addCase(updateRoutedFromDeletedCertificate, (state, action) => {
      state.routedFromDeletedCertificate = action.payload
    })
    .addCase(toggleCertificateFunctionDisabler, (state, action) => {
      state.functionDisablers = toggleFunctionDisabler(state.functionDisablers, action.payload)
    })
)

export default certificateReducer
