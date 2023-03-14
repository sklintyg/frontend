import { RootState } from '../store'
import { ErrorData } from './errorReducer'

export const getActiveError = (state: RootState): ErrorData | undefined => state.ui.uiError.error
