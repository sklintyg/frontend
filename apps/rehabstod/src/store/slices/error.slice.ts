import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ErrorState {
  errorId: string
}

const initialState = {
  errorId: '',
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
    resetErrorState() {
      return initialState
    },
  },
})

export const { setErrorId, resetErrorState } = errorSlice.actions

export const { name: errorReducerPath, reducer: errorReducer } = errorSlice
