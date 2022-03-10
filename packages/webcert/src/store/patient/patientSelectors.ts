import { RootState } from '../store'
import { Patient } from '@frontend/common'

export const getActivePatient = (state: RootState): Patient | undefined => state.ui.uiPatient.patient
