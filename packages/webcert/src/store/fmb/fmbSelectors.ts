import { RootState } from '../store'
import { FMBDiagnosisCodeInfo } from '@frontend/common'
import { ValueDiagnosisList } from '@frontend/common/src'

export const getFMBDiagnosisCodes = (state: RootState): FMBDiagnosisCodeInfo[] => state.ui.uiFMB.fmbDiagnosisCodeInfo

export const getSickLeavePeriodWarning = (state: RootState): string => state.ui.uiFMB.sickLeavePeriodWarning

export const isFMBFunctionDisabled = (state: RootState): boolean => state.ui.uiFMB.functionDisablers.length > 0

export const getDiagnosisListValue = (state: RootState): ValueDiagnosisList | null => state.ui.uiFMB.diagnosisListValue
