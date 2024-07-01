import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getActiveError } from '../../store/error/errorSlice'
import { ErrorCode, ErrorType } from '../../store/error/types'
import CertificateRevoked from './modals/CertificateRevoked'
import ComplementaryCertificateExists from './modals/ComplementaryCertificateExists'
import ConcurrentModification from './modals/ConcurrentModification'
import { messageSubstring, NETWORK_ERROR } from './modals/errorUtils'
import ExternalSystemProblem from './modals/ExternalSystemProblem'
import GeneralErrorReload from './modals/GeneralErrorReload'
import IndeterminateIdentity from './modals/IndeterminateIdentity'
import InvalidStateReplaced from './modals/InvalidStateReplaced'
import ModuleProblem from './modals/ModuleProblem'
import PuProblem from './modals/PuProblem'
import SignCertificateError from './modals/SignCertificateError'

export interface ErrorRoute {
  errorCode: string
  errorId: string
}

const ErrorComponent: React.FC = () => {
  const activeError = useSelector(getActiveError)

  if (!activeError) return null

  const getModal = () => {
    if (messageSubstring(activeError) === NETWORK_ERROR) {
      return <GeneralErrorReload errorData={activeError} />
    }

    switch (activeError.errorCode) {
      case ErrorCode.CONCURRENT_MODIFICATION:
        return <ConcurrentModification errorData={activeError} />
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
      case ErrorCode.SIGN_CERTIFICATE_ERROR:
        return <SignCertificateError errorData={activeError} />
      default:
        return <GeneralErrorReload errorData={activeError} />
    }
  }

  const getErrorComponent = () => {
    switch (activeError.type) {
      case ErrorType.MODAL:
        return getModal()
      case ErrorType.ROUTE:
        return (
          <Redirect
            push
            to={{
              pathname: '/error',
              state: { errorCode: activeError.errorCode, errorId: activeError.errorId },
            }}
          />
        )
      default:
        return null
    }
  }

  return getErrorComponent()
}

export default ErrorComponent
