import { ListType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
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
import store from '../../../store/store'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import ListContainer from '../ListContainer'
import { getConfig, getDefaultList, getFilter } from './listTestUtils'

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
    store.dispatch(updateActiveList(getDefaultList()))
    store.dispatch(updateActiveListConfig(getConfig()))
    store.dispatch(updateActiveListFilter(getFilter()))
    store.dispatch(updateIsLoadingListConfig(false))
  })

  afterEach(() => clearDispatchedActions())

  it('should show error message when error', () => {
    store.dispatch(setListError(error))
    setTimeout(() => {
      renderComponent(false)
      expect(screen.getByText('Sökningen kunde inte utföras')).toBeInTheDocument()
    }, 100)
  })

  it('should show empty list when empty list flag is set', () => {
    renderComponent(true)
    expect(screen.getByAltText('Det finns inga resultat i listan.')).toBeInTheDocument()
  })
})
