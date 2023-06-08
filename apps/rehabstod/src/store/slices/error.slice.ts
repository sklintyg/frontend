import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ErrorState {
  errorId: string
  routingErrorId: string
  errorCode: string
}

const initialState = {
  errorId: '',
  errorCode: '',
  routingErrorId: '',
}

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setErrorId(state, { payload }: PayloadAction<string>) {
      return {
        ...state,
        errorId: payload,
      }
    },
    setRoutingErrorId(state, { payload }: PayloadAction<string>) {
      return {
        ...state,
        routingErrorId: payload,
      }
    },
    setErrorCode(state, { payload }: PayloadAction<string>) {
      return {
        ...state,
        errorCode: payload,
      }
    },
    resetErrorState() {
      return initialState
    },
  },
})

export const { setErrorId, setErrorCode, resetErrorState, setRoutingErrorId } = errorSlice.actions

export const { name: errorReducerPath, reducer: errorReducer } = errorSlice
