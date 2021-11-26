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
import { ErrorCode, ErrorData, ErrorType } from '../../../store/error/errorReducer'
import { clearError } from '../../../store/error/errorActions'
import ErrorModalBase from './ErrorModalBase'

let testStore: EnhancedStore

const history = createMemoryHistory()

const location: Location = window.location
delete window.location
window.location = {
  ...location,
  reload: jest.fn(),
}

const CONFIRM_BUTTON_TEXT = 'CONFIRM_BUTTON_TEXT'
const CLOSE_BUTTON_TEXT = 'CLOSE_BUTTON_TEXT'

const renderComponent = (
  errorData: ErrorData,
  onConfirm = () => {},
  confirmButtonText = CONFIRM_BUTTON_TEXT,
  closeButtonText = CLOSE_BUTTON_TEXT,
  children?: React.ReactFragment
) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <ErrorModalBase errorData={errorData} closeButtonText={closeButtonText} confirmButtonText={confirmButtonText} onConfirm={onConfirm}>
          {children}
        </ErrorModalBase>
      </Router>
    </Provider>
  )
}

describe('ErrorModalBase', () => {
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

  it('shall display confirm button text', () => {
    renderComponent(createError(), undefined, CONFIRM_BUTTON_TEXT)

    expect(screen.getByText(CONFIRM_BUTTON_TEXT)).toBeInTheDocument()
  })

  it('shall display close button text', () => {
    renderComponent(createError(), undefined, undefined, CLOSE_BUTTON_TEXT)

    expect(screen.getByText(CLOSE_BUTTON_TEXT)).toBeInTheDocument()
  })

  it('shall display errorId', () => {
    const expectedText = 'errorid'
    renderComponent(createError(expectedText))

    expect(screen.getByText(expectedText)).toBeInTheDocument()
  })

  it('shall call onConfirm function when clicking confirm button', () => {
    const onConfirm = jest.fn()
    const expectedId = 'test'
    renderComponent(createError(expectedId), onConfirm, CONFIRM_BUTTON_TEXT)

    userEvent.click(screen.getByText(CONFIRM_BUTTON_TEXT))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('shall clear error on close', () => {
    const expectedErrorId = 'errorid'
    clearDispatchedActions()
    renderComponent(createError(expectedErrorId), undefined, undefined, CLOSE_BUTTON_TEXT)

    userEvent.click(screen.getByText(CLOSE_BUTTON_TEXT))

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
