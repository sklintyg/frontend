import type { EnhancedStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { updateActiveListFilterValue, updateActiveListType, updateTotalCount } from '../../../store/list/listActions'
import { listMiddleware } from '../../../store/list/listMiddleware'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { ListFilterType, ListType } from '../../../types'
import ListPagination from './ListPagination'

let testStore: EnhancedStore

function renderComponent() {
  return render(
    <Provider store={testStore}>
      <ListPagination />
    </Provider>
  )
}

beforeEach(() => {
  testStore = configureApplicationStore([listMiddleware])
})

it('should set START_FROM to largest possible when exceeding total', async () => {
  testStore.dispatch(updateActiveListType(ListType.CERTIFICATES))
  testStore.dispatch(updateTotalCount(32))
  testStore.dispatch(updateActiveListFilterValue({ id: 'PAGESIZE', filterValue: { type: ListFilterType.NUMBER, value: 10 } }))
  testStore.dispatch(updateActiveListFilterValue({ id: 'START_FROM', filterValue: { type: ListFilterType.NUMBER, value: 320 } }))

  renderComponent()

  expect(getActiveListFilterValue('START_FROM', ListFilterType.NUMBER)(testStore.getState())?.value).toBe(30)
})
