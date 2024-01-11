import { ListType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { expect, it, describe, beforeEach, afterEach } from 'vitest'
import { getConfig, getDefaultList, getFilter } from './listTestUtils'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { ErrorCode, ErrorData, ErrorType } from '../../../store/error/errorReducer'
import {
  setListError,
  updateActiveList,
  updateActiveListConfig,
  updateActiveListFilter,
  updateIsLoadingListConfig,
} from '../../../store/list/listActions'
import { listMiddleware } from '../../../store/list/listMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import ListContainer from '../ListContainer'

let testStore: EnhancedStore

const error: ErrorData = {
  errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM,
  type: ErrorType.SILENT,
  errorId: '12345',
}

const renderComponent = (showMessageForEmptyList: boolean) => {
  render(
    <Provider store={testStore}>
      <ListContainer type={ListType.UNKOWN} showMessageForEmptyList={showMessageForEmptyList} emptyListIcon="" />
    </Provider>
  )
}

describe('List', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, listMiddleware])
    testStore.dispatch(updateActiveList(getDefaultList()))
    testStore.dispatch(updateActiveListConfig(getConfig()))
    testStore.dispatch(updateActiveListFilter(getFilter()))
    testStore.dispatch(updateIsLoadingListConfig(false))
  })

  afterEach(() => clearDispatchedActions())

  it('should show error message when error', () => {
    testStore.dispatch(setListError(error))
    renderComponent(false)
    expect(screen.getByText('Sökningen kunde inte utföras.')).toBeInTheDocument()
  })

  it('should show empty list when empty list flag is set', () => {
    renderComponent(true)
    expect(screen.getByAltText('Det finns inga resultat i listan.')).toBeInTheDocument()
  })
})
