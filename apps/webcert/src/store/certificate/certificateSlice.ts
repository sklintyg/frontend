import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import {
  Certificate,
  CertificateDataValueType,
  CertificateEvent,
  CertificateSignStatus,
  CertificateStatus,
  Complement,
  ConfigTypes,
  ModalData,
  Patient,
  Unit,
  ValidationError,
  ValueBoolean,
  ValueText,
} from '../../types'
import { FunctionDisabler, toggleFunctionDisabler } from '../../utils/functionDisablerUtils'
import { isShowAlways } from '../../utils/isShowAlways'
import { ErrorData } from '../error/errorReducer'
import { SigningData } from './certificateActions'

interface GotoCertificateDataElement {
  questionId: string
  valueId: string
}

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

const initialState: CertificateState = {
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

const CARE_UNIT_CATEGORY_NAME = 'vardenhet'
const PATIENT_CATEGORY_NAME = 'patient'

const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {
    updateCertificate: (state, action: PayloadAction<Certificate>) => {
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
                textValue.text = ''
              }
              break
            }
            case CertificateDataValueType.BOOLEAN: {
              const booleanValue = question.value as ValueBoolean
              if (booleanValue.selected === undefined) {
                booleanValue.selected = null
              }
            }
          }
        }
      }
    },
    updateCertificateEvents: (state, action: PayloadAction<CertificateEvent[]>) => {
      state.certificateEvents = action.payload
    },
    updateCertificateStatus: (state, action: PayloadAction<CertificateStatus>) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.status = action.payload
    },
    updateCertificateAsReadOnly: (state) => {
      if (!state.certificate) {
        return
      }

      for (const questionId in state.certificate.data) {
        state.certificate.data[questionId].readOnly = true
      }
    },
    setCertificateUnitData: (state, action: PayloadAction<Unit>) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.unit = action.payload
    },
    setCertificatePatientData: (state, action: PayloadAction<Patient>) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.patient = action.payload
    },
    updateCertificateVersion: (state, action: PayloadAction<number>) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.version = action.payload
    },
    showSpinner: (state, action: PayloadAction<string>) => {
      state.spinner = true
      state.spinnerText = action.payload
    },
    hideSpinner: (state) => {
      state.spinner = false
      state.spinnerText = ''
    },
    validateCertificateStarted: (state) => {
      state.validationInProgress = true
    },
    validateCertificateCompleted: (state) => {
      state.validationInProgress = false
    },
    updateValidationErrors: (state, action: PayloadAction<ValidationError[]>) => {
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
    },
    setValidationErrorsForQuestion: (
      state,
      action: PayloadAction<{
        questionId: string
        validationErrors: ValidationError[]
      }>
    ) => {
      if (state.certificate) {
        const question = state.certificate.data[action.payload.questionId]
        if (!question) {
          return
        }

        question.validationErrors = action.payload.validationErrors
      }
    },
    showValidationErrors: (state) => {
      state.showValidationErrors = true
    },
    hideValidationErrors: (state) => {
      state.showValidationErrors = false
    },
    hideCertificateDataElement: (state, action: PayloadAction<string>) => {
      if (!state.certificate) {
        return
      }

      state.certificate.data[action.payload].visible = false
    },
    updateCertificateAsDeleted: (state) => {
      state.certificate = undefined
      state.isDeleted = true
    },
    updateCertificateComplements: (state, action: PayloadAction<Complement[]>) => {
      state.complements = action.payload
    },
    updateGotoCertificateDataElement: (state, action: PayloadAction<GotoCertificateDataElement>) => {
      state.gotoCertificateDataElement = action.payload
    },
    clearGotoCertificateDataElement: (state) => {
      state.gotoCertificateDataElement = undefined
    },
    updateCertificateSigningData: (state, action: PayloadAction<SigningData>) => {
      state.signingData = action.payload
    },
    updateCertificateSignStatus: (state, action: PayloadAction<CertificateSignStatus>) => {
      state.signingStatus = action.payload
    },
    setReadyForSign: (state, action: PayloadAction<string>) => {
      if (!state.certificate) {
        return
      }

      state.certificate.metadata.readyForSign = action.payload
    },
    updateRoutedFromDeletedCertificate: (state, action: PayloadAction<boolean>) => {
      state.routedFromDeletedCertificate = action.payload
    },
    toggleCertificateFunctionDisabler: (state, action: PayloadAction<FunctionDisabler>) => {
      state.functionDisablers = toggleFunctionDisabler(state.functionDisablers, action.payload)
    },
    updateCreatedCertificateId: (state, action: PayloadAction<string>) => {
      state.createdCertificateId = action.payload
    },
    updateIsDeleted: (state, action: PayloadAction<boolean>) => {
      state.isDeleted = action.payload
    },
    updateShouldRouteAfterDelete: (state, action: PayloadAction<boolean>) => {
      state.shouldRouteAfterDelete = action.payload
    },
    resetCertificateState: () => {
      return initialState
    },
    updateModalData: (state, action: PayloadAction<ModalData>) => {
      state.modalData = action.payload
    },
  },
})

export const {
  updateCertificate,
  updateCertificateEvents,
  updateCertificateStatus,
  updateCertificateAsReadOnly,
  setCertificateUnitData,
  setCertificatePatientData,
  updateCertificateVersion,
  showSpinner,
  hideSpinner,
  validateCertificateStarted,
  validateCertificateCompleted,
  updateValidationErrors,
  setValidationErrorsForQuestion,
  showValidationErrors,
  hideValidationErrors,
  hideCertificateDataElement,
  updateCertificateAsDeleted,
  updateCertificateComplements,
  updateGotoCertificateDataElement,
  clearGotoCertificateDataElement,
  updateCertificateSigningData,
  updateCertificateSignStatus,
  setReadyForSign,
  updateRoutedFromDeletedCertificate,
  toggleCertificateFunctionDisabler,
  updateCreatedCertificateId,
  updateIsDeleted,
  updateShouldRouteAfterDelete,
  resetCertificateState,
  updateModalData,
} = certificateSlice.actions

export const certificateReducer = certificateSlice.reducer
