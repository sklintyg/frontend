import { RootState } from '../store'
import { AnyAction, createSelector } from '@reduxjs/toolkit'
import {
  Certificate,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  CertificateEvent,
  CertificateMetadata,
  CertificateRelationType,
  CertificateStatus,
  Complement,
  ResourceLink,
  ResourceLinkType,
  Unit,
  ValidationError,
  ValidationErrorSummary,
} from '@frontend/common'
import { Patient, PersonId } from '@frontend/common/src'
import { getSortedValidationErrorSummary } from '@frontend/common/src/utils/validationUtils'
import { SigningData } from './certificateActions'

export const getIsShowSpinner = (state: RootState): boolean => state.ui.uiCertificate.spinner

export const getSpinnerText = (state: RootState): string => state.ui.uiCertificate.spinnerText

export const getIsValidating = (state: RootState): boolean => state.ui.uiCertificate.validationInProgress

export const getIsValidForSigning = (state: RootState): boolean => state.ui.uiCertificate.isValidForSigning

export const getShowValidationErrors = (state: RootState): boolean => state.ui.uiCertificate.showValidationErrors

export const getCertificate = (state: RootState): Certificate | undefined => state.ui.uiCertificate.certificate

export const getQuestion = (id: string) => (state: RootState): CertificateDataElement | undefined =>
  state.ui.uiCertificate.certificate?.data[id]

export const getIsComplementingCertificate = (state: RootState): boolean => {
  const metadata = state.ui.uiCertificate.certificate?.metadata
  if (!metadata) {
    return false
  }

  return metadata.relations.parent?.type === CertificateRelationType.COMPLEMENTED && metadata.status === CertificateStatus.UNSIGNED
}

export const getComplements = (questionId: string) => (state: RootState): Complement[] =>
  state.ui.uiCertificate.complements.filter((complement) => complement.questionId === questionId)

export const getComplementsIncludingSubQuestions = (questionId: string) => (state: RootState): Complement[] =>
  state.ui.uiCertificate.complements.filter((complement) => complement.questionId === questionId.split('.')[0])

export const getGotoId = (state: RootState): string | undefined => state.ui.uiCertificate.gotoCertificateDataElement?.questionId

export const getIsCertificateDeleted = () => (state: RootState): boolean => state.ui.uiCertificate.isDeleted

export const getIsRoutedFromDeletedCertificate = () => (state: RootState): boolean => state.ui.uiCertificate.routedFromDeletedCertificate

export const getIsUnsigned = () => (state: RootState): boolean =>
  state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.UNSIGNED

export const getIsSigned = () => (state: RootState): boolean =>
  state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.SIGNED

export const getUnit = () => (state: RootState): Unit => {
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

export const getQuestionHasValidationError = (id: string) => (state: RootState): boolean => {
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

export const getCertificateMetaData = (state: RootState): CertificateMetadata | null => {
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
  style?: CertificateDataElementStyleEnum
}

const certificateStructure: CertificateStructure[] = []
export const getCertificateDataElements = createSelector<RootState, Certificate | undefined, CertificateStructure[]>(
  getCertificate,
  (certificate) => {
    certificateStructure.length = 0
    if (!certificate) {
      return []
    }

    for (const questionId in certificate.data) {
      certificateStructure.push({
        id: certificate.data[questionId].id,
        component: certificate.data[questionId].config.type,
        index: certificate.data[questionId].index,
        style: certificate.data[questionId].style,
      })
    }

    certificateStructure.sort((a, b) => a.index - b.index)
    return certificateStructure
  }
)

export const getValidationErrorSummary = () => (state: RootState): ValidationErrorSummary[] => {
  if (!state.ui.uiCertificate.certificate) {
    return []
  }

  return getSortedValidationErrorSummary(state.ui.uiCertificate.certificate)
}

export const getCareUnitValidationErrors = () => (state: RootState): ValidationError[] => {
  if (!state.ui.uiCertificate.certificate || !state.ui.uiCertificate.certificate.metadata.careUnitValidationErrors) {
    return []
  }

  return state.ui.uiCertificate.certificate.metadata.careUnitValidationErrors
}

const doesFieldsMatch = (payloadField: string, validationField: string) => {
  //return !payloadField || (validationField && validationField.includes(payloadField))
  return validationField.includes(payloadField)
}

export const getVisibleValidationErrors = (questionId: string, field: string) => (state: RootState): ValidationError[] => {
  let validationErrors = []
  const clientValidationErrors = state.ui.uiCertificate.clientValidationErrors.filter((v) => v.id === questionId)
  validationErrors = [...clientValidationErrors]

  if (state.ui.uiCertificate.certificate) {
    const question = state.ui.uiCertificate.certificate.data[questionId]
    if (question.validationErrors) {
      validationErrors = [...validationErrors, ...question.validationErrors]
    }

    if (state.ui.uiCertificate.showValidationErrors) {
      return validationErrors.filter((v: ValidationError) => doesFieldsMatch(field, v.field))
    } else {
      return validationErrors.filter((v: ValidationError) => v.showAlways && doesFieldsMatch(field, v.field))
    }
  }
  return validationErrors
}

export const getCertificateEvents = (state: RootState): CertificateEvent[] => state.ui.uiCertificate.certificateEvents

export const getResourceLinks = (state: RootState): ResourceLink[] => state.ui.uiCertificate.certificate?.links ?? []

export const getIsLocked = (state: RootState): boolean =>
  state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.LOCKED ||
  state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.LOCKED_REVOKED

export const getIsEditable = (state: RootState): boolean | undefined =>
  state.ui.uiCertificate.certificate?.links.some((link) => link.type === ResourceLinkType.EDIT_CERTIFICATE)

export const getSigningData = (state: RootState): SigningData | undefined => state.ui.uiCertificate.signingData

export const getIsLatestMajorVersion = (state: RootState): boolean =>
  state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.latestMajorVersion : true

export const getIsPatientDeceased = (state: RootState): boolean =>
  state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.patient.deceased : false

export const getIsPatientProtectedPerson = (state: RootState): boolean =>
  state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.patient.protectedPerson : false

export const getIsPatientTestIndicated = (state: RootState): boolean =>
  state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.patient.testIndicated : false

export const getIsPatientNameDifferentFromEHR = (state: RootState): boolean =>
  state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.patient.differentNameFromEHR : false

export const getPreviousPatientId = (state: RootState): PersonId | undefined =>
  state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.patient.previousPersonId : undefined

export const getIsPatientIdUpdated = (state: RootState): boolean =>
  state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.patient.personIdUpdated : false

export const getPatient = (state: RootState): Patient | undefined =>
  state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.patient : undefined

export const getResponsibleHospName = (state: RootState): string => {
  return state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.responsibleHospName : ''
}

export const isCertificateFunctionDisabled = (state: RootState): boolean => state.ui.uiCertificate.functionDisablers.length > 0
