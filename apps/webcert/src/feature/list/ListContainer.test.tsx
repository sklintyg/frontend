import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { fakeCertificateListItem } from '../../faker/certificate/fakeCertificateListItem'
import { fakeListConfig } from '../../faker/list/fakeListConfig'
import { fakeListFilter } from '../../faker/list/fakeListFilter'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import type { ErrorData } from '../../store/error/errorReducer'
import { ErrorCode, ErrorType } from '../../store/error/errorReducer'
import {
  setListError,
  updateActiveList,
  updateActiveListConfig,
  updateActiveListFilter,
  updateIsLoadingListConfig,
} from '../../store/list/listActions'
import { listMiddleware } from '../../store/list/listMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import { ListType } from '../../types'
import { ListContainer } from './ListContainer'

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
    testStore.dispatch(updateActiveList([fakeCertificateListItem()]))
    testStore.dispatch(updateActiveListConfig(fakeListConfig()))
    testStore.dispatch(updateActiveListFilter(fakeListFilter()))
    testStore.dispatch(updateIsLoadingListConfig(false))
  })

  afterEach(() => clearDispatchedActions())

  it('Should show error message when error', () => {
    testStore.dispatch(setListError(error))
    renderComponent(false)
    expect(screen.getByText('Sökningen kunde inte utföras.')).toBeInTheDocument()
  })

  it('Should have list filters when list request failed', () => {
    testStore.dispatch(setListError(error))
    renderComponent(false)
    expect(screen.getByRole('button', { name: 'Sök' })).toBeInTheDocument()
  })

  it('Should show empty list when empty list flag is set', () => {
    renderComponent(true)
    expect(screen.getByAltText('Det finns inga resultat i listan.')).toBeInTheDocument()
  })
})
