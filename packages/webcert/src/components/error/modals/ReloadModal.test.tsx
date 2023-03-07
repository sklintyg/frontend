import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { vi } from 'vitest'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { clearError } from '../../../store/error/errorActions'
import { errorMiddleware } from '../../../store/error/errorMiddleware'
import { ErrorCode, ErrorData, ErrorType } from '../../../store/error/errorReducer'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import ReloadModal, { RELOAD_CLOSE_BUTTON_TEXT, RELOAD_CONFIRM_BUTTON_TEXT } from './ReloadModal'

let testStore: EnhancedStore

const history = createMemoryHistory()

let location: Location

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
    location = window.location
    vi.spyOn(window, 'location', 'get').mockRestore()
    testStore = configureApplicationStore([dispatchHelperMiddleware, errorMiddleware])
  })

  afterEach(() => {
    vi.resetAllMocks()
    clearDispatchedActions()
  })

  it('renders without crashing', () => {
    expect(() => renderComponent(createError())).not.toThrow()
  })

  it('shall reload page on confirm', () => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...location,
      reload: vi.fn(),
    })
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
