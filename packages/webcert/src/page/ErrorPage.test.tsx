import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../store/reducers'
import ErrorPage from './ErrorPage'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { ErrorCode, ErrorType } from '../store/error/errorReducer'
import { AUTHORIZATION_PROBLEM_MESSAGE, AUTHORIZATION_PROBLEM_TITLE } from '../components/error/errorPageContent/AuthorizationProblem'
import { TIMEOUT_MESSAGE, TIMEOUT_TITLE } from '../components/error/errorPageContent/Timeout'
import { LOGIN_FAILED_MESSAGE, LOGIN_FAILED_TITLE } from '../components/error/errorPageContent/LoginFailed'

let testStore: EnhancedStore
const history = createMemoryHistory()
history.replace = jest.fn()

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

describe('ErrorPage', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('TIMEOUT', () => {
    it('shall display that the user has been logged out due to inactivity', () => {
      history.push('/error', { errorCode: ErrorCode.TIMEOUT, errorId: ERROR_ID })
      renderComponent()

      expect(screen.getByText(TIMEOUT_TITLE)).toBeInTheDocument()
      expect(screen.getByText(TIMEOUT_MESSAGE, { exact: false })).toBeInTheDocument()
    })
  })

  describe('AUTHORIZATION_PROBLEM', () => {
    it('shall display that the user is missing authorization', () => {
      history.push('/error', { errorCode: ErrorCode.AUTHORIZATION_PROBLEM, errorId: ERROR_ID })
      renderComponent()

      expect(screen.getByText(AUTHORIZATION_PROBLEM_TITLE)).toBeInTheDocument()
      expect(screen.getByText(AUTHORIZATION_PROBLEM_MESSAGE, { exact: false })).toBeInTheDocument()
    })
  })

  describe('LOGIN_FAILED', () => {
    it('shall throw error when navigating to page with a reason query param', () => {
      history.push({ pathname: '/error', search: '?reason=login.failed' })
      renderComponent()

      expect(dispatchedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: { type: ErrorType.ROUTE, errorCode: 'LOGIN_FAILED' },
          }),
        ])
      )
    })
  })
})
