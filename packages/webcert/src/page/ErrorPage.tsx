import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AppHeader } from '@frontend/common'
import styled from 'styled-components/macro'
import logo from '../components/header/webcert_logo.png'
import CenteredImageWithContent from '../components/image/CenteredImageWithContent'
import errorImage from '../images/fel-1.svg'
import { ErrorRoute } from '../components/error/ErrorComponent'
import ErrorCopyText from '../components/error/ErrorCopyText'
import { ErrorCode, ErrorType } from '../store/error/errorReducer'
import AuthorizationProblem from '../components/error/errorPageContent/AuthorizationProblem'
import Timeout from '../components/error/errorPageContent/Timeout'
import DataNotFound from '../components/error/errorPageContent/DataNotFound'
import AuthorizationProblemConfidentialityMarking from '../components/error/errorPageContent/AuthorizationProblemConfidentialityMarking'
import AuthorizationProblemConfidentialityMarkingUnit from '../components/error/errorPageContent/AuthorizationProblemConfidentialityMarkingUnit'
import AuthorizationUserSessionAlreadyActive from '../components/error/errorPageContent/AuthorizationUserSessionAlreadyActive'
import UnknownInternalProblem from '../components/error/errorPageContent/UnknownInternalProblem'
import InternalProblem from '../components/error/errorPageContent/InternalProblem'
import ProtectedPersonAgreementError from '../components/error/errorPageContent/ProtectedPersonAgreementError'
import SystemBanners from '../components/notification/SystemBanners'
import LoginFailed from '../components/error/errorPageContent/LoginFailed'
import HSAError from '../components/error/errorPageContent/HSAError'
import MedarbetaruppdragSaknas from '../components/error/errorPageContent/MedarbetaruppdragSaknas'
import { throwError } from '../store/error/errorActions'
import { useDispatch } from 'react-redux'
import AuthorizationProblemResource from '../components/error/errorPageContent/AuthorizationProblemResource'

const Root = styled.div`
  height: 100vh;
`

const TextWrapper = styled.div`
  text-align: center;
  max-width: 475px;
  margin: 0 auto;
`

const ReasonParamErrorCodeMap = new Map<string, ErrorCode>([
  ['login.failed', ErrorCode.LOGIN_FAILED],
  ['login.hsaerror', ErrorCode.LOGIN_HSA_ERROR],
  ['login.medarbetaruppdrag', ErrorCode.LOGIN_MEDARBETARUPPDRAG_SAKNAS],
])

const ErrorPage: React.FC = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  let errorCode: string | undefined
  let errorId: string | undefined

  if (location.state) {
    const state = location.state as ErrorRoute
    errorCode = state.errorCode
    errorId = state.errorId
  }

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search)
      const reason = params.get('reason') ?? ''
      errorCode = ReasonParamErrorCodeMap.get(reason) as string
      dispatch(throwError({ type: ErrorType.ROUTE, errorCode: errorCode as ErrorCode }))
    }
  }, [location.search])

  const getContent = () => {
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
      case ErrorCode.UNKNOWN_INTERNAL_PROBLEM:
      default:
        return <UnknownInternalProblem />
    }
  }

  return (
    <Root>
      <AppHeader logo={logo} alt={'Logo Webcert'} banners={[<SystemBanners key="system-banners" />]} />
      <TextWrapper>
        <CenteredImageWithContent imgSrc={errorImage}>{getContent()}</CenteredImageWithContent>
      </TextWrapper>
      {errorId && <ErrorCopyText errorId={errorId} />}
    </Root>
  )
}

export default ErrorPage
