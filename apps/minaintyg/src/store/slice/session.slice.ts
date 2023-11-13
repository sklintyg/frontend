/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState = {
  hasSessionEnded: false,
}

const sessionSlice = createSlice({
  name: 'sessionSlice',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    updateHasSessionEnded(state, { payload }: PayloadAction<boolean>) {
      state.hasSessionEnded = payload
    },
  },
})

export const { updateHasSessionEnded, reset } = sessionSlice.actions
export const { reducer: sessionReducer, name: sessionReducerPath } = sessionSlice
