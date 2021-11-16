import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../store/reducers'
import { AUTHORIZATION_PROBLEM, TIMEOUT } from '../store/error/errorReducer'
import ErrorPage from './ErrorPage'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { errorMiddleware } from '../store/error/errorMiddleware'

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
        <ErrorPage />
      </Router>
    </Provider>
  )
}

const ERROR_ID = 'ERROR_ID'
const LOGGED_OUT_TITLE = 'Du är utloggad'
const LOGGED_OUT_DESCRIPTION = 'Du har blivit utloggad från Webcert på grund av inaktivitet.'

const AUTHORIZATION_MISSING_TITLE = 'Behörighet saknas'
const AUTHORIZATION_MISSING_DESCRIPTION = 'Du saknar behörighet för att komma åt utkastet.'

describe('ErrorPage', () => {
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

  describe('TIMEOUT', () => {
    it('shall display that the user has been logged out due to inactivity', () => {
      history.push('/error', { errorCode: TIMEOUT, errorId: ERROR_ID })
      renderComponent()

      expect(screen.getByText(LOGGED_OUT_TITLE)).toBeInTheDocument()
      expect(screen.getByText(LOGGED_OUT_DESCRIPTION, { exact: false })).toBeInTheDocument()
    })
  })

  describe('AUTHORIZATION_PROBLEM', () => {
    it('shall display that the user is missing authorization', () => {
      history.push('/error', { errorCode: AUTHORIZATION_PROBLEM, errorId: ERROR_ID })
      renderComponent()

      expect(screen.getByText(AUTHORIZATION_MISSING_TITLE)).toBeInTheDocument()
      expect(screen.getByText(AUTHORIZATION_MISSING_DESCRIPTION, { exact: false })).toBeInTheDocument()
    })
  })
})
