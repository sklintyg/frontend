import type { RootState } from '../store'
import type { ErrorData } from './errorReducer'

export const getActiveError = (state: RootState): ErrorData | undefined => state.ui.uiError.error
