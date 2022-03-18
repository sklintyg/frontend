import { RootState } from '../store'
import { Patient } from '@frontend/common'
import { ErrorRequest } from '../error/errorReducer'

export const getActivePatient = (state: RootState): Patient | undefined => state.ui.uiPatient.patient

export const getPatientError = (state: RootState): ErrorRequest | undefined => state.ui.uiPatient.error
