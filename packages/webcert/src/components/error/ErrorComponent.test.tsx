import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import ErrorComponent from './ErrorComponent'
import {
  CONCURRENT_MODIFICATION,
  CONCURRENT_MODIFICATION_ERROR_MESSAGE,
  ErrorRequest,
  ErrorType,
  TIMEOUT,
} from '../../store/error/errorReducer'
import { clearError, setError, throwError } from '../../store/error/errorActions'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import { errorMiddleware } from '../../store/error/errorMiddleware'

let fakeAxios: MockAdapter
let testStore: EnhancedStore

const history = createMemoryHistory()

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

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

  describe('ErrorType.MODAL, CONCURRENT_MODIFICATION', () => {
    it('shall display concurrent-modification modal if concurrent modification error exists', () => {
      setErrorState(ErrorType.MODAL, CONCURRENT_MODIFICATION)
      renderComponent()

      expect(screen.getByText(CONCURRENT_MODIFICATION_ERROR_MESSAGE)).toBeInTheDocument()
    })

    it('shall reload page on confirm', () => {
      setErrorState(ErrorType.MODAL, CONCURRENT_MODIFICATION)
      renderComponent()

      userEvent.click(screen.getByText('Ladda om intyget'))
      expect(window.location.reload).toHaveBeenCalledTimes(1)
    })

    it('shall clear error on close', () => {
      clearDispatchedActions()
      setErrorState(ErrorType.MODAL, CONCURRENT_MODIFICATION)
      renderComponent()

      userEvent.click(screen.getByText('Stäng'))

      const error = dispatchedActions.find((action) => setError.match(action))
      const clearedError = dispatchedActions.find((action) => clearError.match(action))
      expect(error?.payload.errorId).toEqual(clearedError?.payload.errorId)
    })
  })

  describe('ErrorType.ROUTE, CONCURRENT_MODIFICATION', () => {
    it('shall route user to error page if timeout error exists', () => {
      setErrorState(ErrorType.ROUTE, TIMEOUT)
      renderComponent()

      expect(history.location.pathname).toBe('/error')
    })
  })
})

const setErrorState = (type: ErrorType, errorCode: string) => {
  const error: ErrorRequest = {
    type: type,
    errorCode: errorCode,
  }

  testStore.dispatch(throwError(error))
}
