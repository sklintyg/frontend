import {
  autoFillElement,
  Certificate,
  CertificateDataElementStyleEnum,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateEvent,
  CertificateSignStatus,
  Complement,
  ConfigTypes,
  isShowAlways,
  ModalData,
  setDisableForChildElement,
  ValueBoolean,
  ValueText,
} from '@frontend/common'
import { createReducer } from '@reduxjs/toolkit'
import {
  applyCertificateDataElementAutoFill,
  clearGotoCertificateDataElement,
  disableCertificateDataElement,
  enableCertificateDataElement,
  GotoCertificateDataElement,
  hideCertificateDataElement,
  hideCertificateDataElementMandatory,
  hideSpinner,
  hideValidationErrors,
  highlightCertificateDataElement,
  resetCertificateState,
  setCertificateDataElement,
  setCertificatePatientData,
  setCertificateUnitData,
  setDisabledCertificateDataChild,
  setReadyForSign,
  setValidationErrorsForQuestion,
  showCertificateDataElement,
  showCertificateDataElementMandatory,
  showSpinner,
  showValidationErrors,
  SigningData,
  toggleCertificateFunctionDisabler,
  unhideCertificateDataElement,
  unstyleCertificateDataElement,
  updateCertificate,
  updateCertificateAsDeleted,
  updateCertificateAsReadOnly,
  updateCertificateComplements,
  updateCertificateEvents,
  updateCertificateSigningData,
  updateCertificateSignStatus,
  updateCertificateStatus,
  updateCertificateVersion,
  updateCreatedCertificateId,
  updateGotoCertificateDataElement,
  updateIsDeleted,
  updateModalData,
  updateRoutedFromDeletedCertificate,
  updateShouldRouteAfterDelete,
  updateValidationErrors,
  validateCertificateCompleted,
  validateCertificateStarted,
} from './certificateActions'

import { FunctionDisabler, toggleFunctionDisabler } from '../../utils/functionDisablerUtils'
import { ErrorData } from '../error/errorReducer'

export interface CertificateState {
  certificate?: Certificate
  certificateEvents: CertificateEvent[]
  spinner: boolean
  spinnerText: string
  validationInProgress: boolean
  showValidationErrors: boolean
  isDeleted: boolean
  complements: Complement[]
  gotoCertificateDataElement?: GotoCertificateDataElement
  signingData?: SigningData
  routedFromDeletedCertificate: boolean
  functionDisablers: FunctionDisabler[]
  createdCertificateId: string
  shouldRouteAfterDelete: boolean
  signingStatus: CertificateSignStatus
  signingError?: ErrorData
  modalData: ModalData | null
}

const getInitialState = (): CertificateState => {
  return {
    certificateEvents: [],
    spinner: false,
    spinnerText: '',
    validationInProgress: false,
    showValidationErrors: false,
    isDeleted: false,
    complements: [],
    routedFromDeletedCertificate: false,
    functionDisablers: [],
    createdCertificateId: '',
    shouldRouteAfterDelete: false,
    signingStatus: CertificateSignStatus.INITIAL,
    modalData: null,
  }
}

const CARE_UNIT_CATEGORY_NAME = 'vardenhet'
const PATIENT_CATEGORY_NAME = 'patient'

const certificateReducer = createReducer(getInitialState(), (builder) =>
  builder
    .addCase(updateCertificate, (state, action) => {
      state.certificate = action.payload
      state.isDeleted = false
      state.certificateEvents.splice(0, state.certificateEvents.length)
      for (const questionId in state.certificate.data) {
        const question = state.certificate.data[questionId]
        if (question.visible === undefined) {
          question.visible = true
        }

        if (question.config.type === ConfigTypes.CATEGORY) {
          continue
        }

        if (question.value) {
          switch (question.value.type) {
            case CertificateDataValueType.TEXT: {
              const textValue = question.value as ValueText
              if (textValue.text === undefined) {
                textValue['text'] = ''
              }
              break
            }
            case CertificateDataValueType.BOOLEAN: {
              const booleanValue = question.value as ValueBoolean
              if (booleanValue.selected === undefined) {
                booleanValue['selected'] = null
              }
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

      for (const questionId in state.certificate.data) {
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
    .addCase(setCertificatePatientData, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.patient = action.payload
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
      action.payload = action.payload.map((validationError) => ({ ...validationError, showAlways: isShowAlways(validationError) }))

      if (state.certificate) {
        for (const questionId in state.certificate.data) {
          const question = state.certificate.data[questionId]
          if (!question) {
            continue
          }

          question.validationErrors = action.payload.filter(({ id }) => id === questionId)
        }

        state.certificate.metadata.careUnitValidationErrors = action.payload.filter(({ category }) => category === CARE_UNIT_CATEGORY_NAME)
        state.certificate.metadata.patientValidationErrors = action.payload.filter(({ category }) => category === PATIENT_CATEGORY_NAME)
      }
    })
    .addCase(setValidationErrorsForQuestion, (state, action) => {
      if (state.certificate) {
        const question = state.certificate.data[action.payload.questionId]
        if (!question) {
          return
        }

        question.validationErrors = action.payload.validationErrors
      }
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
    .addCase(unhideCertificateDataElement, (state, action) => {
      if (!state.certificate) {
        return
      }
      if (!state.certificate.data[action.payload].validation.some((v) => v.type === CertificateDataValidationType.SHOW_VALIDATION)) {
        state.certificate.data[action.payload].visible = true
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

      const question = state.certificate.data[action.payload]

      question.disabled = true
      if (question.value && question.value.type === CertificateDataValueType.CODE) {
        question.value.id = ''
        question.value.code = ''
      }
    })
    .addCase(updateCertificateAsDeleted, (state) => {
      state.certificate = undefined
      state.isDeleted = true
    })
    .addCase(setDisabledCertificateDataChild, (state, action) => {
      if (!state.certificate || !action.payload.affectedIds) {
        return
      }
      setDisableForChildElement(state.certificate.data, action.payload)
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
    .addCase(updateCertificateSignStatus, (state, action) => {
      state.signingStatus = action.payload
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
    .addCase(applyCertificateDataElementAutoFill, (state, action) => {
      if (!state.certificate) {
        return
      }

      const { id, validation } = action.payload
      const question = state.certificate.data[id]

      if (validation && question) {
        autoFillElement(validation, question)
      }
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
    .addCase(updateCreatedCertificateId, (state, action) => {
      state.createdCertificateId = action.payload
    })
    .addCase(updateIsDeleted, (state, action) => {
      state.isDeleted = action.payload
    })
    .addCase(updateShouldRouteAfterDelete, (state, action) => {
      state.shouldRouteAfterDelete = action.payload
    })
    .addCase(resetCertificateState, () => getInitialState())
    .addCase(updateModalData, (state, action) => {
      state.modalData = action.payload
    })
)

export default certificateReducer
