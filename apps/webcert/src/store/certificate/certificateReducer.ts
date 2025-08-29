import { createReducer } from '@reduxjs/toolkit'
import type { Certificate, CertificateEvent, Complement, ModalData, ValueBoolean, ValueText } from '../../types'
import {
  CertificateDataElementStyleEnum,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateSignStatus,
  ConfigTypes,
} from '../../types'
import { isClientValidationError } from '../../utils/certificate/getClientValidationErrors'
import type { FunctionDisabler } from '../../utils/functionDisablerUtils'
import type { ErrorData } from '../error/errorReducer'
import type { GotoCertificateDataElement, SigningData } from './certificateActions'
import {
  clearClientValidationErrors,
  clearGotoCertificateDataElement,
  disableCertificateDataElement,
  enableCertificateDataElement,
  hideCertificateDataElement,
  hideCertificateDataElementMandatory,
  hideSpinner,
  hideValidationErrors,
  highlightCertificateDataElement,
  resetCertificateState,
  setCertificatePatientData,
  setCertificateUnitData,
  setQrCodeForElegSignature,
  setReadyForSign,
  showCertificateDataElement,
  showCertificateDataElementMandatory,
  showSpinner,
  showValidationErrors,
  unhideCertificateDataElement,
  unstyleCertificateDataElement,
  updateCertificate,
  updateCertificateAsDeleted,
  updateCertificateAsReadOnly,
  updateCertificateComplements,
  updateCertificateEvents,
  updateCertificateSignStatus,
  updateCertificateSigningData,
  updateCertificateStatus,
  updateCertificateVersion,
  updateCreatedCertificateId,
  updateGotoCertificateDataElement,
  updateIsDeleted,
  updateModalData,
  updateRoutedFromDeletedCertificate,
  updateShouldRouteAfterDelete,
  validateCertificateCompleted,
  validateCertificateStarted,
} from './certificateActions'

export interface CertificateState {
  autoStartToken: string
  certificate?: Certificate
  certificateEvents: CertificateEvent[]
  complements: Complement[]
  createdCertificateId: string
  functionDisablers: FunctionDisabler[]
  gotoCertificateDataElement?: GotoCertificateDataElement
  isDeleted: boolean
  modalData: ModalData | null
  qrCode: string
  routedFromDeletedCertificate: boolean
  shouldRouteAfterDelete: boolean
  showValidationErrors: boolean
  signingData?: SigningData
  signingError?: ErrorData
  signingStatus: CertificateSignStatus
  spinner: boolean
  spinnerText: string
  validationInProgress: boolean
}

const getInitialState = (): CertificateState => {
  return {
    autoStartToken: '',
    certificateEvents: [],
    complements: [],
    createdCertificateId: '',
    functionDisablers: [],
    isDeleted: false,
    modalData: null,
    qrCode: '',
    routedFromDeletedCertificate: false,
    shouldRouteAfterDelete: false,
    showValidationErrors: false,
    signingStatus: CertificateSignStatus.INITIAL,
    spinner: false,
    spinnerText: '',
    validationInProgress: false,
  }
}

const certificateReducer = createReducer(getInitialState(), (builder) =>
  builder
    .addCase(updateCertificate, (state, action) => {
      state.certificate = action.payload
      state.isDeleted = false
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
      state.certificateEvents = action.payload
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
    .addCase(setReadyForSign, (state, action) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.readyForSign = action.payload
    })
    .addCase(updateRoutedFromDeletedCertificate, (state, action) => {
      state.routedFromDeletedCertificate = action.payload
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
    .addCase(clearClientValidationErrors, (state, action) => {
      if (state.certificate?.data[action.payload]) {
        const element = state.certificate.data[action.payload]
        element.validationErrors = (element.validationErrors || []).filter((error) => !isClientValidationError(error.type))
      }
    })
    .addCase(setQrCodeForElegSignature, (state, action) => {
      state.qrCode = action.payload
    })
)

export default certificateReducer
