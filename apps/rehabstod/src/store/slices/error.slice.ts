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
  },
})

export const { setErrorId } = errorSlice.actions

export const { name: errorReducerPath, reducer: errorReducer } = errorSlice
