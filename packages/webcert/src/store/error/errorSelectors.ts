import { RootState } from '../store'
import { ErrorData } from './errorReducer'

export const getActiveError = (state: RootState): ErrorData | null => state.ui.uiError.error
