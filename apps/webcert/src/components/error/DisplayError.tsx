import type React from 'react'
import { ErrorCode } from '../../store/error/errorReducer'
import AuthorizationProblem from './errorPageContent/AuthorizationProblem'
import { AuthorizationProblemConfidentialityMarking } from './errorPageContent/AuthorizationProblemConfidentialityMarking'
import AuthorizationProblemConfidentialityMarkingUnit from './errorPageContent/AuthorizationProblemConfidentialityMarkingUnit'
import AuthorizationProblemResource from './errorPageContent/AuthorizationProblemResource'
import { AuthorizationUserSessionAlreadyActive } from './errorPageContent/AuthorizationUserSessionAlreadyActive'
import DataNotFound from './errorPageContent/DataNotFound'
import { GetCertificateProblem } from './errorPageContent/GetCertificateProblem'
import { HSAError } from './errorPageContent/HSAError'
import { IntegrationNoContentError } from './errorPageContent/IntegrationNoContentError'
import { InternalProblem } from './errorPageContent/InternalProblem'
import { InvalidLaunchIdError } from './errorPageContent/InvalidLaunchIdError'
import LoginFailed from './errorPageContent/LoginFailed'
import { MedarbetaruppdragSaknas } from './errorPageContent/MedarbetaruppdragSaknas'
import ProtectedPersonAgreementError from './errorPageContent/ProtectedPersonAgreementError'
import Timeout from './errorPageContent/Timeout'
import { UnknownInternalProblem } from './errorPageContent/UnknownInternalProblem'
import { AuthorizationProblemSubscription } from './errorPageContent/AuthorizationProblemSubscription'

interface Props {
  errorCode?: string
  fallback?: string
}

const DisplayError: React.FC<Props> = ({ errorCode, fallback }) => {
  switch (errorCode) {
    case ErrorCode.TIMEOUT:
      return <Timeout />
    case ErrorCode.DATA_NOT_FOUND:
      return <DataNotFound />
    case ErrorCode.AUTHORIZATION_PROBLEM:
      return <AuthorizationProblem />
    case ErrorCode.AUTHORIZATION_PROBLEM_RESOURCE:
      return <AuthorizationProblemResource />
    case ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING:
      return <AuthorizationProblemConfidentialityMarking />
    case ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET:
      return <AuthorizationProblemConfidentialityMarkingUnit />
    case ErrorCode.AUTHORIZATION_PROBLEM_SUBSCRIPTION:
      return <AuthorizationProblemSubscription />
    case ErrorCode.AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE:
      return <AuthorizationUserSessionAlreadyActive />
    case ErrorCode.INTERNAL_PROBLEM:
      return <InternalProblem />
    case ErrorCode.NOT_APPROVED_PROTECTED_PERSON_AGREEMENT:
      return <ProtectedPersonAgreementError />
    case ErrorCode.LOGIN_FAILED:
      return <LoginFailed />
    case ErrorCode.LOGIN_HSA_ERROR:
      return <HSAError />
    case ErrorCode.LOGIN_MEDARBETARUPPDRAG_SAKNAS:
      return <MedarbetaruppdragSaknas />
    case ErrorCode.GET_CERTIFICATE_PROBLEM:
      return <GetCertificateProblem />
    case ErrorCode.INVALID_LAUNCHID:
      return <InvalidLaunchIdError />
    case ErrorCode.INTEGRATION_NOCONTENT:
      return <IntegrationNoContentError />
    case ErrorCode.UNKNOWN_INTERNAL_PROBLEM:
    default:
      return fallback != null ? <p>{fallback}</p> : <UnknownInternalProblem />
  }
}

export default DisplayError
