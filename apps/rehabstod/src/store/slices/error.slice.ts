import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ErrorState {
  errorId: string
  errorCode: string
}

const initialState = {
  errorId: '',
  errorCode: '',
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

export const { setErrorId, setErrorCode, resetErrorState } = errorSlice.actions

export const { name: errorReducerPath, reducer: errorReducer } = errorSlice
