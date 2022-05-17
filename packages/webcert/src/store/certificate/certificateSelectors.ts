import { RootState } from '../store'
import { createSelector } from '@reduxjs/toolkit'
import {
  Certificate,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  CertificateEvent,
  CertificateMetadata,
  CertificateRelationType,
  CertificateStatus,
  Complement,
  ConfigTypes,
  Patient,
  PersonId,
  ResourceLink,
  ResourceLinkType,
  Unit,
  ValidationError,
  ValidationErrorSummary,
} from '@frontend/common'
import { getSortedValidationErrorSummary } from '@frontend/common/src/utils/validationUtils'
import { sortByIndex } from '@frontend/common/src/utils/certificateUtils'
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

export const getComplementsForQuestions = (questionIds: string[]) => (state: RootState): Complement[] =>
  state.ui.uiCertificate.complements.filter((complement) => questionIds.includes(complement.questionId))

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
      isInactive: false,
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
  subQuestionIds: string[]
  component: string
  index: number
  style?: CertificateDataElementStyleEnum
}

let certificateStructure: CertificateStructure[] = []
export const getCertificateDataElements = createSelector<RootState, Certificate | undefined, CertificateStructure[]>(
  getCertificate,
  (certificate) => {
    certificateStructure.length = 0
    if (!certificate) {
      return []
    }

    const elements = Object.values(certificate.data)

    certificateStructure = elements.reduce((structure: CertificateStructure[], element: CertificateDataElement) => {
      if (structure.some((s) => s.subQuestionIds.includes(element.id))) return structure

      const subQuestionIds = elements
        .filter(() => element.config.type !== ConfigTypes.CATEGORY)
        .filter((el) => el.config.type !== ConfigTypes.CATEGORY)
        .filter((el) => el.parent === element.id)
        .sort(sortByIndex)
        .map((el) => el.id)

      structure.push({
        id: element.id,
        subQuestionIds,
        component: element.config.type,
        index: element.index,
        style: element.style,
      })

      return structure
    }, [])

    certificateStructure.sort(sortByIndex)
    return certificateStructure
  }
)

export const getValidationErrorSummary = () => (state: RootState): ValidationErrorSummary[] => {
  if (!state.ui.uiCertificate.certificate) {
    return []
  }

  return getSortedValidationErrorSummary(state.ui.uiCertificate.certificate, state.ui.uiCertificate.clientValidationErrors)
}

export const getCareUnitValidationErrors = () => (state: RootState): ValidationError[] => {
  if (!state.ui.uiCertificate.certificate || !state.ui.uiCertificate.certificate.metadata.careUnitValidationErrors) {
    return []
  }

  return state.ui.uiCertificate.certificate.metadata.careUnitValidationErrors
}

const doesFieldsMatch = (payloadField: string, validationField: string) => {
  return !validationField || validationField.includes(payloadField)
}

export const getVisibleValidationErrors = (questionId: string, field: string) => (state: RootState): ValidationError[] => {
  let validationErrors
  const clientValidationErrors = state.ui.uiCertificate.clientValidationErrors.filter((v) => v.id === questionId)
  validationErrors = [...clientValidationErrors]

  if (state.ui.uiCertificate.certificate) {
    const question = state.ui.uiCertificate.certificate.data[questionId]
    if (question && question.validationErrors) {
      let serverValidationErrors = question.validationErrors
      if (clientValidationErrors.length > 0) {
        serverValidationErrors = serverValidationErrors.filter((v) => v.type !== 'EMPTY')
      }
      validationErrors = [...validationErrors, ...serverValidationErrors]
    }
  }

  if (state.ui.uiCertificate.showValidationErrors) {
    return validationErrors.filter((v: ValidationError) => doesFieldsMatch(field, v.field))
  } else {
    return validationErrors.filter((v: ValidationError) => v.showAlways && doesFieldsMatch(field, v.field))
  }
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

export const getCertificateId = () => (state: RootState): string => state.ui.uiCertificate.createdCertificateId

export const getShouldRouteAfterDelete = () => (state: RootState): boolean => state.ui.uiCertificate.shouldRouteAfterDelete
