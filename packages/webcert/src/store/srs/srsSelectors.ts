import { RootState } from '../store'
import { ValueDiagnosisList } from '@frontend/common'

export const getDiagnosisListValue = (state: RootState): ValueDiagnosisList | null => state.ui.uiSRS.diagnosisListValue

export const getDiagnosisCodes = (state: RootState): string[] => state.ui.uiSRS.diagnosisCodes

export const getHasError = (state: RootState): boolean => state.ui.uiSRS.error
