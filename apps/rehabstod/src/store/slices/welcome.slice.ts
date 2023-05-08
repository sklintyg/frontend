/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface WelcomeState {
  selectedLogin: string | null
  selectedUnit: string | null
  selectedFilter: string
  freeText: string | null
}

const initialState = { selectedFilter: 'all' } as WelcomeState

const welcomeSlice = createSlice({
  name: 'welcome',
  initialState,
  reducers: {
    selectLogin(state, { payload }: PayloadAction<string>) {
      state.selectedLogin = payload
    },
    selectUnit(state, { payload }: PayloadAction<string>) {
      state.selectedUnit = payload
    },
    selectFilter(state, { payload }: PayloadAction<string>) {
      state.selectedFilter = payload
    },
    updateFreetext(state, { payload }: PayloadAction<string | null>) {
      state.freeText = payload
    },
  },
})

export const { selectLogin, selectUnit, selectFilter, updateFreetext } = welcomeSlice.actions
export const { name: welcomeReducerPath, reducer: welcomeReducer } = welcomeSlice
