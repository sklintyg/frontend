import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../../store/reducers'
import userEvent from '@testing-library/user-event'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { errorMiddleware } from '../../../store/error/errorMiddleware'
import ReloadModal, { RELOAD_CLOSE_BUTTON_TEXT, RELOAD_CONFIRM_BUTTON_TEXT } from './ReloadModal'
import { ErrorCode, ErrorData, ErrorType } from '../../../store/error/errorReducer'
import { clearError, setError } from '../../../store/error/errorActions'

let testStore: EnhancedStore

const history = createMemoryHistory()

const location: Location = window.location
delete window.location
window.location = {
  ...location,
  reload: jest.fn(),
}

const renderComponent = (errorData: ErrorData) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <ReloadModal errorData={errorData} />
      </Router>
    </Provider>
  )
}

describe('ReloadModal', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, errorMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('renders without crashing', () => {
    renderComponent(createError())
  })

  it('shall reload page on confirm', () => {
    renderComponent(createError())

    userEvent.click(screen.getByText(RELOAD_CONFIRM_BUTTON_TEXT))
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })

  it('shall display confirm button text', () => {
    renderComponent(createError())

    expect(screen.getByText(RELOAD_CONFIRM_BUTTON_TEXT)).toBeInTheDocument()
  })

  it('shall display close button text', () => {
    renderComponent(createError())

    expect(screen.getByText(RELOAD_CLOSE_BUTTON_TEXT)).toBeInTheDocument()
  })

  it('shall clear error on close', () => {
    const expectedErrorId = 'errorid'
    clearDispatchedActions()
    renderComponent(createError(expectedErrorId))

    userEvent.click(screen.getByText(RELOAD_CLOSE_BUTTON_TEXT))

    const clearedError = dispatchedActions.find((action) => clearError.match(action))
    expect(expectedErrorId).toEqual(clearedError?.payload.errorId)
  })
})

const createError = (errorId = '123'): ErrorData => {
  return {
    errorCode: ErrorCode.CONCURRENT_MODIFICATION,
    errorId: errorId,
    type: ErrorType.ROUTE,
  }
}
