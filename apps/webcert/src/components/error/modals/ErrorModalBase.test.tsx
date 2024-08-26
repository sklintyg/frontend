import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { vi } from 'vitest'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { clearError } from '../../../store/error/errorActions'
import { errorMiddleware } from '../../../store/error/errorMiddleware'
import type { ErrorData } from '../../../store/error/errorReducer'
import { ErrorCode, ErrorType } from '../../../store/error/errorReducer'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import ErrorModalBase from './ErrorModalBase'

let testStore: EnhancedStore

const history = createMemoryHistory()

const { location } = window
window.location = {
  ...location,
  reload: vi.fn(),
}

const CONFIRM_BUTTON_TEXT = 'CONFIRM_BUTTON_TEXT'
const CLOSE_BUTTON_TEXT = 'CLOSE_BUTTON_TEXT'

const createError = (errorId = '123'): ErrorData => ({
  errorCode: ErrorCode.CONCURRENT_MODIFICATION,
  errorId,
  type: ErrorType.ROUTE,
})

const renderComponent = ({ children, ...props }: ComponentProps<typeof ErrorModalBase>) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <ErrorModalBase {...props}>{children}</ErrorModalBase>
      </Router>
    </Provider>
  )
}

describe('ErrorModalBase', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, errorMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('renders without crashing', () => {
    expect(() => renderComponent({ errorData: createError() })).not.toThrow()
  })

  it('shall display confirm button text', () => {
    renderComponent({ errorData: createError(), confirmButtonText: CONFIRM_BUTTON_TEXT })

    expect(screen.getByText(CONFIRM_BUTTON_TEXT)).toBeInTheDocument()
  })

  it('shall display close button text', () => {
    renderComponent({ errorData: createError(), closeButtonText: CLOSE_BUTTON_TEXT })

    expect(screen.getByText(CLOSE_BUTTON_TEXT)).toBeInTheDocument()
  })

  it('shall display errorId', () => {
    const expectedText = 'errorid'
    renderComponent({ errorData: createError(expectedText) })

    expect(screen.getByText(expectedText, { exact: false })).toBeInTheDocument()
  })

  it('shall call onConfirm function when clicking confirm button', async () => {
    const onConfirm = vi.fn()
    const expectedId = 'test'
    renderComponent({ errorData: createError(expectedId), onConfirm, confirmButtonText: CONFIRM_BUTTON_TEXT })

    await userEvent.click(screen.getByText(CONFIRM_BUTTON_TEXT))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('shall clear error on close', async () => {
    const expectedErrorId = 'errorid'
    clearDispatchedActions()
    renderComponent({ errorData: createError(expectedErrorId), closeButtonText: CLOSE_BUTTON_TEXT })

    await userEvent.click(screen.getByText(CLOSE_BUTTON_TEXT))

    const clearedError = dispatchedActions.find((action) => clearError.match(action))
    expect(expectedErrorId).toEqual(clearedError?.payload.errorId)
  })
})
