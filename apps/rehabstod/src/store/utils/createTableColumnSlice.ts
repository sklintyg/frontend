import type { EntityState, PayloadAction } from '@reduxjs/toolkit';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { UserPreferences } from '../../schemas'
import type { TableColumn } from '../../schemas/tableSchema'
import { api } from '../api'

export function createTableColumnSlice<T extends keyof UserPreferences>(sliceName: T, columns: string[]) {
  const columnsAdapter = createEntityAdapter<TableColumn, string>({
    selectId: ({ name }) => name,
    sortComparer: (a, b) => (a.index < b.index ? -1 : 1),
  })

  function getSelectors<V>(selectState: (state: V) => EntityState<TableColumn, string>) {
    return {
      ...columnsAdapter.getSelectors(selectState),
      selectColumnString: (state: V) =>
        columnsAdapter
          .getSelectors(selectState)
          .selectAll(state)
          .map(({ name, visible }) => `${name}:${visible ? '1' : '0'}`)
          .join(';'),
    }
  }

  const { selectAll } = columnsAdapter.getSelectors()

  const initialState = columnsAdapter.getInitialState()

  const slice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
      reset() {
        return initialState
      },
      setColumnDefaults(state) {
        columnsAdapter.setAll(
          state,
          columns.map((name, index) => ({ name, visible: true, disabled: false, index }))
        )
      },
      showColumn(state, { payload }: PayloadAction<string>) {
        columnsAdapter.updateOne(state, { id: payload, changes: { visible: true } })
      },
      hideColumn(state, { payload }: PayloadAction<string>) {
        columnsAdapter.updateOne(state, { id: payload, changes: { visible: false } })
      },
      enableColumn(state, { payload }: PayloadAction<string>) {
        columnsAdapter.updateOne(state, { id: payload, changes: { disabled: false } })
      },
      disableColumn(state, { payload }: PayloadAction<string>) {
        columnsAdapter.updateOne(state, { id: payload, changes: { disabled: true } })
      },
      showAllColumns(state) {
        columnsAdapter.updateMany(
          state,
          selectAll(state).map((column) => ({ id: column.name, changes: { visible: true } }))
        )
      },
      hideAllColumns(state) {
        columnsAdapter.updateMany(
          state,
          selectAll(state).map((column) => ({ id: column.name, changes: { visible: false } }))
        )
      },
      moveColumn(state, { payload: { target, keys } }: PayloadAction<{ target: string; keys: string[] }>) {
        const enteties = columnsAdapter.getSelectors().selectAll(state)

        keys.forEach((key) => {
          const from = enteties.findIndex(({ name }) => name === key)
          const targetIndex = enteties.findIndex(({ name }) => name === target)
          enteties.splice(targetIndex, 0, ...enteties.splice(from, 1))
        })

        columnsAdapter.setAll(
          state,
          enteties.map((col, index) => ({ ...col, index }))
        )
      },
    },
    extraReducers: (builder) => {
      /**
       * When table preferences is loaded for the first time columns get's parsed and populated.
       * Rest of the session will store changes to user preferences but continue to use local state.
       */
      builder.addMatcher(api.endpoints.getUser.matchFulfilled, (state, { payload }) => {
        if (columnsAdapter.getSelectors().selectTotal(state) === 0) {
          const preferences = payload.preferences[sliceName]
          const savedColumns = (preferences?.split(';').filter(Boolean) ?? []).map((col, index) => {
            const [name, visible] = col.split(':')
            return { name, index, visible: visible === '1' }
          })

          columnsAdapter.setAll(
            state,
            columns.map((name, index) => ({
              ...{ name, visible: true, disabled: false, index },
              ...savedColumns.find((column) => name === column.name),
            }))
          )
        }
      })
    },
  })

  return {
    slice,
    getSelectors,
    reducerPath: sliceName,
  }
}
