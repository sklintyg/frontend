import type { FMBDiagnosisCodeInfo, ValueDiagnosisList } from '../../types'
import type { RootState } from '../reducer'

export const getFMBDiagnosisCodes = (state: RootState): FMBDiagnosisCodeInfo[] => state.ui.uiFMB.fmbDiagnosisCodeInfo

export const getPeriodWarning = (state: RootState): string => state.ui.uiFMB.sickLeavePeriodWarning

export const getDiagnosisListValue = (state: RootState): ValueDiagnosisList | null => state.ui.uiFMB.diagnosisListValue
