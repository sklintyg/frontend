import React from 'react'
import { useSelector } from 'react-redux'
import { getActiveError } from '../../store/error/errorSelectors'
import { useHistory } from 'react-router-dom'
import { ErrorCode, ErrorType } from '../../store/error/errorReducer'
import ConcurrentModification from './modals/ConcurrentModification'
import UnknownInternalProblem from './modals/UnknownInternalProblem'
import InvalidState from './modals/InvalidState'
import InvalidStateReplaced from './modals/InvalidStateReplaced'
import ComplementaryCertificateExists from './modals/ComplementaryCertificateExists'
import AuthorizationProblem from './modals/AuthorizationProblem'
import AuthorizationProblemConfidentialityMarking from './modals/AuthorizationProblemConfidentialityMarking'

export interface ErrorRoute {
  errorCode: string
  errorId: string
}

const ErrorComponent: React.FC = () => {
  const activeError = useSelector(getActiveError)
  const history = useHistory()

  if (!activeError) return null

  const getModal = () => {
    switch (activeError.errorCode) {
      case ErrorCode.CONCURRENT_MODIFICATION:
        return <ConcurrentModification errorData={activeError} />
      case (ErrorCode.INTERNAL_PROBLEM, ErrorCode.UNKNOWN_INTERNAL_PROBLEM):
        return <UnknownInternalProblem errorData={activeError} />
      case ErrorCode.INVALID_STATE:
        return <InvalidState errorData={activeError} />
      case ErrorCode.INVALID_STATE_REPLACED:
        return <InvalidStateReplaced errorData={activeError} />
      case ErrorCode.COMPLEMENT_INTYG_EXISTS:
        return <ComplementaryCertificateExists errorData={activeError} />
      case ErrorCode.AUTHORIZATION_PROBLEM:
        return <AuthorizationProblem errorData={activeError} />
      case ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING:
        return <AuthorizationProblemConfidentialityMarking errorData={activeError} />
      default:
        return <UnknownInternalProblem errorData={activeError} />
    }
  }

  const getErrorComponent = () => {
    switch (activeError.type) {
      case ErrorType.MODAL:
        return getModal()
      case ErrorType.ROUTE:
        history.push({
          pathname: '/error',
          state: { errorCode: activeError.errorCode, errorId: activeError.errorId },
        })
        return null
      default:
        return null
    }
  }

  return getErrorComponent()
}

export default ErrorComponent
