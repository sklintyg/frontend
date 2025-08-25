import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { throwError } from '../../store/error/errorActions'
import { errorMiddleware } from '../../store/error/errorMiddleware'
import type { ErrorRequest } from '../../store/error/errorReducer'
import { ErrorCode, ErrorType } from '../../store/error/errorReducer'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import ErrorComponent from './ErrorComponent'
import { CERTIFICATE_REVOKED_MESSAGE, CERTIFICATE_REVOKED_TITLE } from './modals/CertificateRevoked'
import { COMPLEMENTARY_CERTIFICATE_EXISTS_MESSAGE } from './modals/ComplementaryCertificateExists'
import { CONCURRENT_MODIFICATION_ERROR_MESSAGE, CONCURRENT_MODIFICATION_ERROR_TITLE } from './modals/ConcurrentModification'
import {
  EXTERNAL_SYSTEM_PROBLEM_MESSAGE,
  EXTERNAL_SYSTEM_PROBLEM_MESSAGE_2,
  EXTERNAL_SYSTEM_PROBLEM_TITLE,
} from './modals/ExternalSystemProblem'
import { GENERAL_ERROR_MESSAGE, GENERAL_ERROR_TITLE } from './modals/GeneralErrorReload'
import { INDETERMINATE_IDENTITY_MESSAGE, INDETERMINATE_IDENTITY_TITLE } from './modals/IndeterminateIdentity'
import { INVALID_STATE_REPLACED_MESSAGE, INVALID_STATE_TITLE } from './modals/InvalidStateReplaced'
import { MODULE_PROBLEM_MESSAGE, MODULE_PROBLEM_TITLE } from './modals/ModuleProblem'
import { PU_PROBLEM_MESSAGE, PU_PROBLEM_MESSAGE_2, PU_PROBLEM_TITLE } from './modals/PuProblem'
import { SIGN_CERTIFICATE_ERROR_TITLE } from './modals/SignCertificateError'

let testStore: EnhancedStore

const setErrorState = (type: ErrorType, errorCode: ErrorCode) => {
  const error: ErrorRequest = {
    type,
    errorCode,
  }

  testStore.dispatch(throwError(error))
}

function ErrorPage() {
  const location = useLocation()
  return <>{location.state.errorCode}</>
}

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<ErrorComponent />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('ErrorComponent', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, errorMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('renders without crashing', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  describe('ErrorType.MODAL,', () => {
    it('shall display ErrorCode.CONCURRENT_MODIFICATION information', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.CONCURRENT_MODIFICATION)
      renderComponent()

      expect(screen.getByText(CONCURRENT_MODIFICATION_ERROR_TITLE)).toBeInTheDocument()
      expect(screen.getByText(CONCURRENT_MODIFICATION_ERROR_MESSAGE)).toBeInTheDocument()
    })

    it('shall display ErrorCode.INVALID_STATE_REPLACED information', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.INVALID_STATE_REPLACED)
      renderComponent()

      expect(screen.getByText(INVALID_STATE_TITLE)).toBeInTheDocument()
      expect(screen.getByText(INVALID_STATE_REPLACED_MESSAGE)).toBeInTheDocument()
    })

    it('shall display ErrorCode.COMPLEMENT_INTYG_EXISTS information', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.COMPLEMENT_INTYG_EXISTS)
      renderComponent()

      expect(screen.getByText(INVALID_STATE_TITLE)).toBeInTheDocument()
      expect(screen.getByText(COMPLEMENTARY_CERTIFICATE_EXISTS_MESSAGE)).toBeInTheDocument()
    })

    it('shall display ErrorCode.PU_PROBLEM information', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.PU_PROBLEM)
      renderComponent()

      expect(screen.getByText(PU_PROBLEM_TITLE)).toBeInTheDocument()
      expect(screen.getByText(PU_PROBLEM_MESSAGE)).toBeInTheDocument()
      expect(screen.getByText(PU_PROBLEM_MESSAGE_2, { exact: false })).toBeInTheDocument()
    })

    it('shall display ErrorCode.EXTERNAL_SYSTEM_PROBLEM information', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.EXTERNAL_SYSTEM_PROBLEM)
      renderComponent()

      expect(screen.getByText(EXTERNAL_SYSTEM_PROBLEM_TITLE)).toBeInTheDocument()
      expect(screen.getByText(EXTERNAL_SYSTEM_PROBLEM_MESSAGE, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(EXTERNAL_SYSTEM_PROBLEM_MESSAGE_2, { exact: false })).toBeInTheDocument()
    })

    it('shall display ErrorCode.MODULE_PROBLEM information', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.MODULE_PROBLEM)
      renderComponent()

      expect(screen.getByText(MODULE_PROBLEM_TITLE)).toBeInTheDocument()
      expect(screen.getByText(MODULE_PROBLEM_MESSAGE)).toBeInTheDocument()
    })

    it('shall display ErrorCode.INDETERMINATE_IDENTITY information', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.INDETERMINATE_IDENTITY)
      renderComponent()

      expect(screen.getByText(INDETERMINATE_IDENTITY_TITLE)).toBeInTheDocument()
      expect(screen.getByText(INDETERMINATE_IDENTITY_MESSAGE)).toBeInTheDocument()
    })

    it('shall display ErrorCode.CERTIFICATE_REVOKED information', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.CERTIFICATE_REVOKED)
      renderComponent()

      expect(screen.getByText(CERTIFICATE_REVOKED_TITLE)).toBeInTheDocument()
      expect(screen.getByText(CERTIFICATE_REVOKED_MESSAGE)).toBeInTheDocument()
    })

    it('shall display ErrorCode.MISSING_PARAMETER information', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.MISSING_PARAMETER)
      renderComponent()

      expect(screen.getByText(GENERAL_ERROR_TITLE)).toBeInTheDocument()
      expect(screen.getByText(GENERAL_ERROR_MESSAGE, { exact: false })).toBeInTheDocument()
    })

    it('shall display ErrorCode.SIGN_CERTIFICATE_PROBLEM information', () => {
      setErrorState(ErrorType.MODAL, ErrorCode.SIGN_CERTIFICATE_ERROR)
      renderComponent()

      expect(screen.getByText(SIGN_CERTIFICATE_ERROR_TITLE)).toBeInTheDocument()
    })
  })

  describe('ErrorType.ROUTE', () => {
    it.each([
      ErrorCode.TIMEOUT,
      ErrorCode.DATA_NOT_FOUND,
      ErrorCode.AUTHORIZATION_PROBLEM,
      ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING,
      ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET,
      ErrorCode.AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE,
      ErrorCode.INTERNAL_PROBLEM,
      ErrorCode.UNKNOWN_INTERNAL_PROBLEM,
      ErrorCode.INVALID_LAUNCHID,
    ])('shall route user to error page if %s error exists', (code) => {
      setErrorState(ErrorType.ROUTE, code)
      renderComponent()

      expect(screen.getByText(code)).toBeInTheDocument()
    })
  })
})
