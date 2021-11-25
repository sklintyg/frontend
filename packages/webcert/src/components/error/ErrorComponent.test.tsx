import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import userEvent from '@testing-library/user-event'
import ErrorComponent, { CONCURRENT_MODIFICATION_ERROR_MESSAGE } from './ErrorComponent'
import { ErrorCode, ErrorRequest, ErrorType } from '../../store/error/errorReducer'
import { clearError, setError, throwError } from '../../store/error/errorActions'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import { errorMiddleware } from '../../store/error/errorMiddleware'

let testStore: EnhancedStore

const history = createMemoryHistory()

const location: Location = window.location
delete window.location
window.location = {
  ...location,
  reload: jest.fn(),
}

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <ErrorComponent />
      </Router>
    </Provider>
  )
}

describe('ErrorComponent', () => {
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
    renderComponent()
  })

  describe('ErrorType.MODAL, ErrorCode.CONCURRENT_MODIFICATION', () => {
    it('shall display concurrent-modification modal if concurrent modification error exists', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.CONCURRENT_MODIFICATION)
      renderComponent()

      expect(screen.getByText(CONCURRENT_MODIFICATION_ERROR_MESSAGE)).toBeInTheDocument()
    })

    it('shall display errorId', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.CONCURRENT_MODIFICATION)
      renderComponent()

      const error = dispatchedActions.find((action) => setError.match(action))
      expect(screen.getByText(error?.payload.errorId)).toBeInTheDocument()
    })
  })

  describe('ErrorType.ROUTE, CONCURRENT_MODIFICATION', () => {
    it('shall route user to error page if timeout error exists', () => {
      setErrorState(ErrorType.ROUTE, ErrorCode.TIMEOUT)
      renderComponent()

      expect(history.location.pathname).toBe('/error')
    })
  })
})

const setErrorState = (type: ErrorType, errorCode: ErrorCode) => {
  const error: ErrorRequest = {
    type: type,
    errorCode: errorCode,
  }

  testStore.dispatch(throwError(error))
}
