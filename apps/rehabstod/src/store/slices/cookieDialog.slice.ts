/* eslint-disable no-param-reassign */
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showCookieDialog: false,
}

const cookieDialogSlice = createSlice({
  name: 'cookieDialog',
  initialState,
  reducers: {
    resetCookieDialogState() {
      return initialState
    },
    updateShowCookieDialog(state, { payload }: PayloadAction<boolean>) {
      state.showCookieDialog = payload
    },
  },
})

export const { resetCookieDialogState, updateShowCookieDialog } = cookieDialogSlice.actions
export const { name: cookieDialogReducerPath, reducer: cookieDialogReducer } = cookieDialogSlice
