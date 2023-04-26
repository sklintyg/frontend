import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit'
import { UserPreferencesTableSettings } from '../../schemas'
import { TableColumn } from '../../schemas/tableSchema'
import { api } from '../api'

export function createTableColumnSlice<T extends UserPreferencesTableSettings>(sliceName: T, columns: string[]) {
  const columnsAdapter = createEntityAdapter<TableColumn>({
    selectId: ({ name }) => name,
  })

  function getSelectors<V>(selectState: (state: V) => EntityState<TableColumn>) {
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

  return {
    getSelectors,
    slice: createSlice({
      name: sliceName,
      initialState: columnsAdapter.getInitialState(),
      reducers: {
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
        checkAllColumns(state) {
          columnsAdapter.updateMany(
            state,
            selectAll(state).map((column) => ({ id: column.name, changes: { visible: true } }))
          )
        },
        uncheckAllColumns(state) {
          columnsAdapter.updateMany(
            state,
            selectAll(state).map((column) => ({ id: column.name, changes: { visible: false } }))
          )
        },
        // moveColumn(state, { payload: { column, direction } }: PayloadAction<{ column: string; direction: 'left' | 'right' }>) {
        //   const from = state.entities.findIndex(({ name }) => name === column)
        //   const to = direction === 'right' ? from + 1 : from - 1
        //   state.entities.splice(to, 0, ...state.entities.splice(from, 1))
        // },
      },
      extraReducers: (builder) => {
        builder.addMatcher(api.endpoints.getUser.matchFulfilled, (state, { payload }) => {
          const preferences = payload.preferences[sliceName]
          const savedColumns = (preferences?.split(';').filter(Boolean) ?? []).map((col) => {
            const [name, visible] = col.split(':')
            return { name, visible: visible === '1' }
          })

          columnsAdapter.setAll(
            state,
            columns.map((name, index) => ({
              ...{ name, visible: true, disabled: false },
              ...savedColumns.find((column) => name === column.name),
              index,
            }))
          )
        })
      },
    }),
  }
}
