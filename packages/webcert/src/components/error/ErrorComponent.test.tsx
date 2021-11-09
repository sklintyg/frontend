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
import { CONCURRENT_MODIFICATION, CONCURRENT_MODIFICATION_ERROR_MESSAGE, ErrorRequest, ErrorType } from '../../store/error/errorReducer'
import { createError, setError } from '../../store/error/errorActions'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import { errorMiddleware } from '../../store/error/errorMiddleware'

let fakeAxios: MockAdapter
let testStore: EnhancedStore

const history = createMemoryHistory()

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

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

  it('shall display concurrent-modification modal if error exists', () => {
    setErrorState(ErrorType.MODAL, CONCURRENT_MODIFICATION)
    renderComponent()

    expect(screen.getByText(CONCURRENT_MODIFICATION_ERROR_MESSAGE)).toBeInTheDocument()
  })
})

const setErrorState = (type: ErrorType, errorCode: string) => {
  const error: ErrorRequest = {
    type: type,
    errorCode: errorCode,
  }

  testStore.dispatch(createError(error))
}
