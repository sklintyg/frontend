/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserPreferences } from '../../schemas'
import { api } from '../api'

export interface TableColumn {
  name: string
  enabled: boolean
}

export function createTableColumnSlice<T extends keyof UserPreferences>(sliceName: T, columns: string[]) {
  const initialState: TableColumn[] = columns.map((name) => ({ name, enabled: true }))

  return createSlice({
    name: sliceName,
    initialState,
    reducers: {
      enableColumn(state, { payload }: PayloadAction<string>) {
        state[state.findIndex(({ name }) => name === payload)].enabled = true
      },
      disableColumn(state, { payload }: PayloadAction<string>) {
        state[state.findIndex(({ name }) => name === payload)].enabled = false
      },
      toggleAll(state, { payload }: PayloadAction<boolean>) {
        return state.map(({ name }) => ({ name, enabled: payload }))
      },
      moveColumn(state, { payload: { column, direction } }: PayloadAction<{ column: string; direction: 'left' | 'right' }>) {
        const from = state.findIndex(({ name }) => name === column)
        const to = direction === 'right' ? from + 1 : from - 1
        return state.splice(to, 0, ...state.splice(from, 1))
      },
    },
    extraReducers: (builder) => {
      builder.addMatcher(api.endpoints.getUser.matchFulfilled, (state, { payload }) => {
        const preferences = payload.preferences[sliceName]
        const savedColumns = (preferences?.split(';').filter(Boolean) ?? []).map((col) => {
          const [name, enabled] = col.split(':')
          return { name, enabled: enabled === '1' }
        })

        state = columns.map((column) => ({
          name: column,
          enabled: true,
          ...savedColumns.find(({ name }) => name === column),
        }))
      })
    },
  })
}
