import React from 'react'
import { useSelector } from 'react-redux'
import { getActiveError } from '../../store/error/errorSelectors'
import { useHistory } from 'react-router-dom'
import { ErrorCode, ErrorType } from '../../store/error/errorReducer'
import ConcurrentModification from './modals/ConcurrentModification'
import InvalidState from './modals/InvalidState'
import InvalidStateReplaced from './modals/InvalidStateReplaced'
import ComplementaryCertificateExists from './modals/ComplementaryCertificateExists'
import PuProblem from './modals/PuProblem'
import IndeterminateIdentity from './modals/IndeterminateIdentity'
import ExternalSystemProblem from './modals/ExternalSystemProblem'
import ModuleProblem from './modals/ModuleProblem'
import CertificateRevoked from './modals/CertificateRevoked'
import GeneralErrorReload from './modals/GeneralErrorReload'
import SendQuestionProblem from './modals/SendQuestionProblem'

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
      case ErrorCode.INVALID_STATE:
        return <InvalidState errorData={activeError} />
      case ErrorCode.INVALID_STATE_REPLACED:
        return <InvalidStateReplaced errorData={activeError} />
      case ErrorCode.COMPLEMENT_INTYG_EXISTS:
        return <ComplementaryCertificateExists errorData={activeError} />
      case ErrorCode.PU_PROBLEM:
        return <PuProblem errorData={activeError} />
      case ErrorCode.EXTERNAL_SYSTEM_PROBLEM:
        return <ExternalSystemProblem errorData={activeError} />
      case ErrorCode.MODULE_PROBLEM:
        return <ModuleProblem errorData={activeError} />
      case ErrorCode.INDETERMINATE_IDENTITY:
        return <IndeterminateIdentity errorData={activeError} />
      case ErrorCode.CERTIFICATE_REVOKED:
        return <CertificateRevoked errorData={activeError} />
      case ErrorCode.MISSING_PARAMETER:
        return <GeneralErrorReload errorData={activeError} />
      case ErrorCode.SEND_QUESTION_PROBLEM:
        return <SendQuestionProblem errorData={activeError} />
      default:
        return <GeneralErrorReload errorData={activeError} />
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
