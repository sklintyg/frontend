import { RootState } from '../store'
import { CertificateType, Patient } from '@frontend/common'
import { ErrorRequest } from '../error/errorReducer'

export const getActivePatient = (state: RootState): Patient | undefined => state.ui.uiPatient.patient

export const getPatientError = (state: RootState): ErrorRequest | undefined => state.ui.uiPatient.error

export const selectCertificateTypes = (state: RootState): CertificateType[] => state.ui.uiPatient.certificateTypes

export const loadingCertificateTypes = (state: RootState): boolean => state.ui.uiPatient.loadingCertificateTypes
