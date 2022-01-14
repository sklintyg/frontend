import React from 'react'
import { useLocation } from 'react-router-dom'
import { AppHeader } from '@frontend/common'
import styled from 'styled-components/macro'
import logo from '../components/header/webcert_logo.png'
import CenteredImageWithContent from '../components/image/CenteredImageWithContent'
import errorImage from '../images/fel-1.svg'
import { ErrorRoute } from '../components/error/ErrorComponent'
import ErrorCopyText from '../components/error/ErrorCopyText'
import { ErrorCode } from '../store/error/errorReducer'
import AuthorizationProblem from '../components/error/errorPageContent/AuthorizationProblem'
import Timeout from '../components/error/errorPageContent/Timeout'
import DataNotFound from '../components/error/errorPageContent/DataNotFound'
import AuthorizationProblemConfidentialityMarking from '../components/error/errorPageContent/AuthorizationProblemConfidentialityMarking'
import AuthorizationProblemConfidentialityMarkingUnit from '../components/error/errorPageContent/AuthorizationProblemConfidentialityMarkingUnit'
import AuthorizationUserSessionAlreadyActive from '../components/error/errorPageContent/AuthorizationUserSessionAlreadyActive'
import UnknownInternalProblem from '../components/error/errorPageContent/UnknownInternalProblem'
import InternalProblem from '../components/error/errorPageContent/InternalProblem'
import ProtectedPersonAgreementError from '../components/error/errorPageContent/ProtectedPersonAgreementError'

const Root = styled.div`
  height: 100vh;
`

const TextWrapper = styled.div`
  text-align: center;
  max-width: 475px;
  margin: 0 auto;
`

const ErrorPage: React.FC = () => {
  const location = useLocation()

  if (!location.state) return null

  const { errorCode, errorId } = location.state as ErrorRoute

  const getContent = () => {
    switch (errorCode) {
      case ErrorCode.TIMEOUT:
        return <Timeout />
      case ErrorCode.DATA_NOT_FOUND:
        return <DataNotFound />
      case ErrorCode.AUTHORIZATION_PROBLEM:
        return <AuthorizationProblem />
      case ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING:
        return <AuthorizationProblemConfidentialityMarking />
      case ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET:
        return <AuthorizationProblemConfidentialityMarkingUnit />
      case ErrorCode.AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE:
        return <AuthorizationUserSessionAlreadyActive />
      case ErrorCode.INTERNAL_PROBLEM:
        return <InternalProblem />
      case ErrorCode.UNKNOWN_INTERNAL_PROBLEM:
        return <UnknownInternalProblem />
      case ErrorCode.NOT_APPROVED_PROTECTED_PERSON_AGREEMENT:
        return <ProtectedPersonAgreementError />
      default:
        return <UnknownInternalProblem />
    }
  }

  return (
    <Root>
      <AppHeader logo={logo} alt={'Logo Webcert'} />
      <TextWrapper>
        <CenteredImageWithContent imgSrc={errorImage}>{getContent()}</CenteredImageWithContent>
      </TextWrapper>
      <ErrorCopyText errorId={errorId} />
    </Root>
  )
}

export default ErrorPage
