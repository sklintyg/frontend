import { RootState } from '../store'
import { FMBDiagnosisCodeInfo } from '@frontend/common'

export const getFMBDiagnosisCodes = (state: RootState): FMBDiagnosisCodeInfo[] => state.ui.uiFMB.fmbDiagnosisCodeInfo
