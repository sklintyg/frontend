import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState: {
  pathname?: string
  replace: boolean
} = {
  pathname: undefined,
  replace: false,
}

const navigateSlice = createSlice({
  name: 'navigate',
  initialState,
  reducers: {
    push: (state, { payload }: PayloadAction<string>) => {
      state.pathname = payload
    },
    replace: (state, { payload }: PayloadAction<string>) => {
      state.pathname = payload
      state.replace = true
    },
    reset: () => {
      return initialState
    },
  },
})

export const { reset, push, replace } = navigateSlice.actions
export const navigateReducer = navigateSlice.reducer
