import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AUTHORIZATION_PROBLEM_MESSAGE, AUTHORIZATION_PROBLEM_TITLE } from '../components/error/errorPageContent/AuthorizationProblem'
import {
  GO_TO_START_TEXT,
  TIMEOUT_MESSAGE_ORIGIN_INTEGRATED,
  TIMEOUT_MESSAGE_ORIGIN_NORMAL,
  TIMEOUT_TITLE,
} from '../components/error/errorPageContent/Timeout'
import { fakeUser } from '../faker'
import { configureApplicationStore } from '../store/configureApplicationStore'
import { ErrorCode, ErrorType } from '../store/error/errorReducer'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateUser } from '../store/user/userActions'
import ErrorPage from './ErrorPage'

let testStore: EnhancedStore

const renderComponent = ({ state, search }: { state?: { errorCode: ErrorCode; errorId: string }; search?: string }) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[{ pathname: '/', state, search }]}>
        <Routes>
          <Route path="/" element={<ErrorPage />} />
        </Routes>
      </MemoryRouter>
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
    it('shall display that the user with origin djupintegration has been logged out due to inactivity', () => {
      testStore.dispatch(updateUser(fakeUser({ origin: 'DJUPINTEGRATION' })))

      renderComponent({ state: { errorCode: ErrorCode.TIMEOUT, errorId: ERROR_ID } })

      expect(screen.getByText(TIMEOUT_TITLE)).toBeInTheDocument()
      expect(screen.getByText(TIMEOUT_MESSAGE_ORIGIN_INTEGRATED, { exact: false })).toBeInTheDocument()
    })

    it('shall display that the user with origin normal has been logged out due to inactivity', () => {
      testStore.dispatch(updateUser(fakeUser({ origin: 'NORMAL' })))

      renderComponent({ state: { errorCode: ErrorCode.TIMEOUT, errorId: ERROR_ID } })

      expect(screen.getByText(TIMEOUT_TITLE)).toBeInTheDocument()
      expect(screen.getByText(TIMEOUT_MESSAGE_ORIGIN_NORMAL, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(GO_TO_START_TEXT)).toBeInTheDocument()
    })

    it('shall not show error id for timeout', () => {
      renderComponent({ state: { errorCode: ErrorCode.TIMEOUT, errorId: ERROR_ID } })

      expect(screen.queryByText(ERROR_ID, { exact: false })).not.toBeInTheDocument()
    })
  })

  describe('AUTHORIZATION_PROBLEM_SUBSCRIPTION', () => {
    it('shall display that the user has been logged out due to inactivity', () => {
      renderComponent({ search: '?reason=auth-exception-subscription' })

      expect(dispatchedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: { type: ErrorType.ROUTE, errorCode: 'AUTHORIZATION_PROBLEM_SUBSCRIPTION' },
          }),
        ])
      )
    })

    it('shall not show error id for timeout', () => {
      renderComponent({ state: { errorCode: ErrorCode.AUTHORIZATION_PROBLEM_SUBSCRIPTION, errorId: ERROR_ID } })

      expect(screen.queryByText(ERROR_ID, { exact: false })).not.toBeInTheDocument()
    })
  })

  describe('AUTHORIZATION_PROBLEM', () => {
    it('shall display that the user is missing authorization', () => {
      renderComponent({ state: { errorCode: ErrorCode.AUTHORIZATION_PROBLEM, errorId: ERROR_ID } })

      expect(screen.getByText(AUTHORIZATION_PROBLEM_TITLE)).toBeInTheDocument()
      expect(screen.getByText(AUTHORIZATION_PROBLEM_MESSAGE, { exact: false })).toBeInTheDocument()
    })

    it('shall not show error id for AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET', () => {
      renderComponent({ state: { errorCode: ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET, errorId: ERROR_ID } })

      expect(screen.queryByText(ERROR_ID, { exact: false })).not.toBeInTheDocument()
    })
  })

  describe('LOGIN_FAILED', () => {
    it('shall throw error when navigating to page with a reason query param', () => {
      renderComponent({ search: '?reason=login.failed' })

      expect(dispatchedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: { type: ErrorType.ROUTE, errorCode: 'LOGIN_FAILED' },
          }),
        ])
      )
    })

    it('shall show error id', () => {
      renderComponent({ state: { errorCode: ErrorCode.LOGIN_FAILED, errorId: ERROR_ID } })

      expect(screen.getByText(ERROR_ID, { exact: false })).toBeInTheDocument()
    })
  })

  describe('LOGIN_HSAERROR', () => {
    it('shall throw error when navigating to page with a reason query param', () => {
      renderComponent({ search: '?reason=login.hsaerror' })

      expect(dispatchedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: { type: ErrorType.ROUTE, errorCode: 'LOGIN_HSA_ERROR' },
          }),
        ])
      )
    })

    it('shall show error id', () => {
      renderComponent({ state: { errorCode: ErrorCode.LOGIN_HSA_ERROR, errorId: ERROR_ID } })

      expect(screen.getByText(ERROR_ID, { exact: false })).toBeInTheDocument()
    })
  })

  describe('LOGIN_MEDARBETARUPPDRAG_SAKNAS', () => {
    it('shall throw error when navigating to page with a reason query param', () => {
      renderComponent({ search: '?reason=login.medarbetaruppdrag' })

      expect(dispatchedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: { type: ErrorType.ROUTE, errorCode: 'LOGIN_MEDARBETARUPPDRAG_SAKNAS' },
          }),
        ])
      )
    })

    it('shall show error id', () => {
      renderComponent({ state: { errorCode: ErrorCode.LOGIN_MEDARBETARUPPDRAG_SAKNAS, errorId: ERROR_ID } })

      expect(screen.getByText(ERROR_ID, { exact: false })).toBeInTheDocument()
    })
  })

  describe('AUTHORIZATION_PROBLEM_SEKRETESSMARKERING', () => {
    it('shall throw error when navigating to page with a reason query param', () => {
      renderComponent({ search: '?reason=auth-exception-sekretessmarkering' })

      expect(dispatchedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: { type: ErrorType.ROUTE, errorCode: 'AUTHORIZATION_PROBLEM_SEKRETESSMARKERING' },
          }),
        ])
      )
    })

    it('shall show error id', () => {
      renderComponent({ state: { errorCode: ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING, errorId: ERROR_ID } })

      expect(screen.getByText(ERROR_ID, { exact: false })).toBeInTheDocument()
    })
  })

  describe('AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE', () => {
    it('shall throw error when navigating to page with a reason query param', () => {
      renderComponent({ search: '?reason=auth-exception-user-already-active' })

      expect(dispatchedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: { type: ErrorType.ROUTE, errorCode: 'AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE' },
          }),
        ])
      )
    })

    it('shall show error id', () => {
      renderComponent({ state: { errorCode: ErrorCode.AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE, errorId: ERROR_ID } })

      expect(screen.getByText(ERROR_ID, { exact: false })).toBeInTheDocument()
    })
  })

  describe('INTEGRATION_NOCONTENT', () => {
    it('shall throw error when navigating to page with a reason query param', () => {
      renderComponent({ search: '?reason=integration.nocontent' })

      expect(dispatchedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: { type: ErrorType.ROUTE, errorCode: 'INTEGRATION_NOCONTENT' },
          }),
        ])
      )
    })

    it('shall show error id', () => {
      renderComponent({ state: { errorCode: ErrorCode.INTEGRATION_NOCONTENT, errorId: ERROR_ID } })

      expect(screen.getByText(ERROR_ID, { exact: false })).toBeInTheDocument()
    })
  })

  describe('UNKNOWN_INTERNAL_PROBLEM', () => {
    it('shall throw error when navigating to page with a reason query param', () => {
      renderComponent({ search: '?reason=unknown' })

      expect(dispatchedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: { type: ErrorType.ROUTE, errorCode: 'UNKNOWN_INTERNAL_PROBLEM' },
          }),
        ])
      )
    })

    it('shall show error id', () => {
      renderComponent({ state: { errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, errorId: ERROR_ID } })

      expect(screen.getByText(ERROR_ID, { exact: false })).toBeInTheDocument()
    })
  })

  describe('PU_PROBLEM', () => {
    it('shall throw error when navigating to page with a reason query param', () => {
      renderComponent({ search: '?reason=pu-problem' })

      expect(dispatchedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: { type: ErrorType.ROUTE, errorCode: 'UNKNOWN_INTERNAL_PROBLEM' },
          }),
        ])
      )
    })

    it('shall show error id', () => {
      renderComponent({ state: { errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, errorId: ERROR_ID } })

      expect(screen.getByText(ERROR_ID, { exact: false })).toBeInTheDocument()
    })
  })

  describe('MISSING_PARAMETER', () => {
    it('shall throw error when navigating to page with a reason query param', () => {
      renderComponent({ search: '?reason=missing-parameter' })

      expect(dispatchedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: { type: ErrorType.ROUTE, errorCode: 'UNKNOWN_INTERNAL_PROBLEM' },
          }),
        ])
      )
    })

    it('shall show error id', () => {
      renderComponent({ state: { errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, errorId: ERROR_ID } })

      expect(screen.getByText(ERROR_ID, { exact: false })).toBeInTheDocument()
    })
  })
})
