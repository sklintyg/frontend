import { RootState } from '../store'
import { Patient } from '@frontend/common'

export const getPatient = (state: RootState): Patient | undefined => state.ui.uiPatient.patient
