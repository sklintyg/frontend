import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AUTHORIZATION_PROBLEM_MESSAGE, AUTHORIZATION_PROBLEM_TITLE } from '../components/error/errorPageContent/AuthorizationProblem'
import { TIMEOUT_MESSAGE, TIMEOUT_TITLE } from '../components/error/errorPageContent/Timeout'
import { configureApplicationStore } from '../store/configureApplicationStore'
import { ErrorCode, ErrorType } from '../store/error/errorReducer'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../store/test/dispatchHelperMiddleware'
import ErrorPage from './ErrorPage'

let testStore: EnhancedStore
const history = createMemoryHistory()
history.replace = vi.fn()

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
    testStore = configureApplicationStore([dispatchHelperMiddleware])
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

    it('shall not show error id for timeout', () => {
      history.push('/error', { errorCode: ErrorCode.TIMEOUT, errorId: ERROR_ID })
      renderComponent()

      expect(screen.queryByText(ERROR_ID, { exact: false })).not.toBeInTheDocument()
    })
  })

  describe('AUTHORIZATION_PROBLEM', () => {
    it('shall display that the user is missing authorization', () => {
      history.push('/error', { errorCode: ErrorCode.AUTHORIZATION_PROBLEM, errorId: ERROR_ID })
      renderComponent()

      expect(screen.getByText(AUTHORIZATION_PROBLEM_TITLE)).toBeInTheDocument()
      expect(screen.getByText(AUTHORIZATION_PROBLEM_MESSAGE, { exact: false })).toBeInTheDocument()
    })

    it('shall not show error id for AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET', () => {
      history.push('/error', { errorCode: ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET, errorId: ERROR_ID })
      renderComponent()

      expect(screen.queryByText(ERROR_ID, { exact: false })).not.toBeInTheDocument()
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

    it('shall show error id', () => {
      history.push('/error', { errorCode: ErrorCode.LOGIN_FAILED, errorId: ERROR_ID })
      renderComponent()

      expect(screen.getByText(ERROR_ID, { exact: false })).toBeInTheDocument()
    })
  })
})
