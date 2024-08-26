import { getByType } from '@frontend/utils'
import { createSelector } from '@reduxjs/toolkit'
import { uniqWith } from 'lodash-es'
import type {
  Certificate,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  CertificateEvent,
  CertificateMetadata,
  CertificateSignStatus,
  Complement,
  MessageType,
  ModalData,
  Patient,
  PersonId,
  ResourceLink,
  Unit,
  ValidationError} from '../../types';
import {
  CertificateRelationType,
  CertificateStatus,
  ConfigTypes,
  QuestionType,
  ResourceLinkType
} from '../../types'
import { structureCertificate } from '../../utils/structureCertificate'
import type { ValidationErrorSummary} from '../../utils/validation/sortedValidationErrorSummary';
import { sortedValidationErrorSummary } from '../../utils/validation/sortedValidationErrorSummary'
import type { ErrorData } from '../error/errorReducer'
import type { RootState } from '../store'
import type { SigningData } from './certificateActions'

export const getIsShowSpinner = (state: RootState): boolean => state.ui.uiCertificate.spinner

export const getSpinnerText = (state: RootState): string => state.ui.uiCertificate.spinnerText

export const getIsValidating = (state: RootState): boolean => state.ui.uiCertificate.validationInProgress

export const getIsValidForSigning = (state: RootState): boolean =>
  state.ui.uiCertificate.certificate != null
    ? Object.values(state.ui.uiCertificate.certificate.data)
        .map(({ validationErrors }) => validationErrors)
        .flat().length === 0
    : false

export const getShowValidationErrors = (state: RootState): boolean => state.ui.uiCertificate.showValidationErrors

export const getCertificate = (state: RootState): Certificate | undefined => state.ui.uiCertificate.certificate

export const getQuestion =
  (id: string) =>
  (state: RootState): CertificateDataElement | undefined =>
    state.ui.uiCertificate.certificate?.data[id]

export const displayAsMandatory =
  (questionId: string) =>
  (state: RootState): boolean => {
    const question = getQuestion(questionId)(state)
    return (
      (!question?.readOnly && question?.mandatory && !question?.disabled && question.config.type !== ConfigTypes.UE_VISUAL_ACUITY) ?? false
    )
  }

export const getIsComplementingCertificate = (state: RootState): boolean => {
  const metadata = state.ui.uiCertificate.certificate?.metadata
  if (!metadata) {
    return false
  }

  return metadata.relations.parent?.type === CertificateRelationType.COMPLEMENTED && metadata.status === CertificateStatus.UNSIGNED
}

export const getComplements =
  (questionId: string) =>
  (state: RootState): Complement[] =>
    state.ui.uiCertificate.complements.filter((complement) => complement.questionId === questionId)

export const getComplementsIncludingSubQuestions =
  (questionId: string) =>
  (state: RootState): Complement[] =>
    state.ui.uiCertificate.complements.filter((complement) => complement.questionId === questionId.split('.')[0])

export const getComplementsForQuestions =
  (questionIds: string[]) =>
  (state: RootState): Complement[] =>
    state.ui.uiCertificate.complements.filter((complement) => questionIds.includes(complement.questionId))

export const getGotoId = (state: RootState): string | undefined => state.ui.uiCertificate.gotoCertificateDataElement?.questionId

export const getIsCertificateDeleted =
  () =>
  (state: RootState): boolean =>
    state.ui.uiCertificate.isDeleted

export const getIsRoutedFromDeletedCertificate =
  () =>
  (state: RootState): boolean =>
    state.ui.uiCertificate.routedFromDeletedCertificate

export const getIsUnsigned =
  () =>
  (state: RootState): boolean =>
    state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.UNSIGNED

export const getIsSigned =
  () =>
  (state: RootState): boolean =>
    state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.SIGNED

export const getUnit =
  () =>
  (state: RootState): Unit => {
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

export const getCertificateMetaData = (state: RootState): CertificateMetadata | null => {
  const { certificate } = state.ui.uiCertificate
  if (!certificate) {
    return null
  }

  return certificate.metadata
}

export const getCertificateMessageTypes = (state: RootState): MessageType[] => {
  const fallback = [
    { type: QuestionType.MISSING, subject: 'Välj typ av fråga' },
    { type: QuestionType.COORDINATION, subject: 'Avstämningsmöte' },
    { type: QuestionType.CONTACT, subject: 'Kontakt' },
    { type: QuestionType.OTHER, subject: 'Övrigt' },
  ]
  return getCertificateMetaData(state)?.messageTypes || fallback
}

export interface CertificateStructure {
  id: string
  subQuestionIds: string[]
  component: string
  index: number
  style?: CertificateDataElementStyleEnum
}

export const getCertificateDataElements = createSelector(getCertificate, (certificate) => {
  return certificate == null ? [] : structureCertificate(certificate.data)
})

export const getValidationErrorSummary =
  () =>
  (state: RootState): ValidationErrorSummary[] => {
    if (!state.ui.uiCertificate.certificate) {
      return []
    }

    return sortedValidationErrorSummary(state.ui.uiCertificate.certificate)
  }

export const getCareUnitValidationErrors =
  () =>
  (state: RootState): ValidationError[] => {
    if (!state.ui.uiCertificate.certificate || !state.ui.uiCertificate.certificate.metadata.careUnitValidationErrors) {
      return []
    }

    return state.ui.uiCertificate.certificate.metadata.careUnitValidationErrors
  }

export const getPatientValidationErrors =
  () =>
  (state: RootState): ValidationError[] => {
    if (!state.ui.uiCertificate.certificate || !state.ui.uiCertificate.certificate.metadata.patientValidationErrors) {
      return []
    }

    return state.ui.uiCertificate.certificate.metadata.patientValidationErrors
  }

const doesFieldsMatch = (payloadField: string, validationField: string) => {
  return !validationField || validationField.includes(payloadField)
}

const getQuestionServerValidationErrors =
  (questionId: string) =>
  (state: RootState): ValidationError[] => {
    const question = getQuestion(questionId)(state)
    return question?.validationErrors ?? []
  }

export const getVisibleValidationErrors =
  (questionId: string, field?: string) =>
  (state: RootState): ValidationError[] => {
    const showValidationErrors = getShowValidationErrors(state)

    return uniqWith<ValidationError>(
      getQuestionServerValidationErrors(questionId)(state)
        .filter((v) => showValidationErrors || v.showAlways)
        .filter((v) => (field != null ? doesFieldsMatch(field, v.field) : true)),
      (a, b) => `${a.field}_${a.type}` === `${b.field}_${b.type}`
    )
  }

export const getCertificateEvents = (state: RootState): CertificateEvent[] => state.ui.uiCertificate.certificateEvents

export const getCertificateResourceLinks = (state: RootState): ResourceLink[] => state.ui.uiCertificate.certificate?.links ?? []
export const getCertificateResourceLink =
  (type: ResourceLinkType) =>
  (state: RootState): ResourceLink | undefined =>
    getByType(getCertificateResourceLinks(state), type)

export const getIsLocked = (state: RootState): boolean =>
  state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.LOCKED ||
  state.ui.uiCertificate.certificate?.metadata.status === CertificateStatus.LOCKED_REVOKED

export const getIsEditable = (state: RootState): boolean | undefined =>
  state.ui.uiCertificate.certificate?.links.some((link) => link.type === ResourceLinkType.EDIT_CERTIFICATE)

export const getSigningData = (state: RootState): SigningData | undefined => state.ui.uiCertificate.signingData
export const getSigningError = (state: RootState): ErrorData | undefined => state.ui.uiCertificate.signingError

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

export const getPatient = (state: RootState): Patient | undefined =>
  state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.patient : undefined

export const getResponsibleHospName = (state: RootState): string => {
  return state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.responsibleHospName : ''
}

export const isCertificateFunctionDisabled = (state: RootState): boolean => state.ui.uiCertificate.functionDisablers.length > 0

export const getCertificateId =
  () =>
  (state: RootState): string =>
    state.ui.uiCertificate.createdCertificateId

export const getShouldRouteAfterDelete =
  () =>
  (state: RootState): boolean =>
    state.ui.uiCertificate.shouldRouteAfterDelete

export const getIsPatientIdChanged = (state: RootState): boolean =>
  state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.patient.personIdChanged : false

export const getIsReserveId = (state: RootState): boolean =>
  state.ui.uiCertificate.certificate ? state.ui.uiCertificate.certificate.metadata.patient.reserveId : false

export const getSigningStatus = (state: RootState): CertificateSignStatus => state.ui.uiCertificate.signingStatus

export const getRecipient = (state: RootState): string | undefined => state.ui.uiCertificate.certificate?.metadata.sentTo

export const getModalData =
  () =>
  (state: RootState): ModalData | null =>
    state.ui.uiCertificate.modalData
