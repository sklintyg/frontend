import { randomUUID } from '@frontend/utils'
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import { updateCertificate } from '../certificate/certificateActions'
import { startListening } from '../listenerMiddleware'
import { RootState } from '../store'
import { ErrorData, ErrorLogRequest, ErrorRequest, ErrorState, ErrorType } from './types'

const initialState: ErrorState = {}

const errorSlice = createSlice({
  name: 'uiError',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<ErrorData>) {
      state.error = action.payload
    },
    setActiveCertificateId(state, action: PayloadAction<string>) {
      state.activeCertificateId = action.payload
    },
    clearError(state) {
      state.error = undefined
    },
  },
})

export const throwError = createAction<ErrorRequest>(`Throw error`)

startListening({
  actionCreator: throwError,
  effect: async (action, { dispatch, getState }) => {
    const errorData: ErrorData = !action.payload.errorId
      ? { ...action.payload, errorId: randomUUID() }
      : { ...action.payload, errorId: action.payload.errorId as string }

    if (!errorData.certificateId) {
      errorData.certificateId = getState().ui.uiError.activeCertificateId
    }

    if (errorData.type !== ErrorType.SILENT) {
      dispatch(setError(errorData))
    }

    const message = action.payload.message ? action.payload.message : 'No message'
    const errorLogRequest: ErrorLogRequest = { ...errorData, message }

    dispatch(
      apiCallBegan({
        data: errorLogRequest,
        method: 'POST',
        url: '/api/log/error',
      })
    )
  },
})

startListening({
  actionCreator: updateCertificate,
  effect: async (action, { dispatch }) => {
    dispatch(setActiveCertificateId(action.payload.metadata.id))
  },
})

export const getActiveError = (state: RootState): ErrorData | undefined => state.ui.uiError.error

export const { setError, setActiveCertificateId, clearError } = errorSlice.actions

export const errorReducer = errorSlice.reducer
