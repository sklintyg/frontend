import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import AppHeader from '../components/AppHeader/AppHeader'
import DisplayError from '../components/error/DisplayError'
import type { ErrorRoute } from '../components/error/ErrorComponent'
import ErrorCopyText from '../components/error/ErrorCopyText'
import CenteredImageWithContent from '../components/image/CenteredImageWithContent'
import SystemBanners from '../components/notification/SystemBanners'
import errorImage from '../images/fel-1.svg'
import logo from '../images/webcert_logo.png'
import { throwError } from '../store/error/errorActions'
import { ErrorCode, ErrorType } from '../store/error/errorReducer'

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
  ['auth-exception', ErrorCode.AUTHORIZATION_PROBLEM],
  ['auth-exception-sekretessmarkering', ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING],
  ['auth-exception-subscription', ErrorCode.AUTHORIZATION_PROBLEM_SUBSCRIPTION],
  ['auth-exception-resource', ErrorCode.AUTHORIZATION_PROBLEM_RESOURCE],
  ['auth-exception-user-already-active', ErrorCode.AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE],
  ['integration.nocontent', ErrorCode.INTEGRATION_NOCONTENT],
  ['unknown', ErrorCode.UNKNOWN_INTERNAL_PROBLEM],
  ['pu-problem', ErrorCode.UNKNOWN_INTERNAL_PROBLEM],
  ['missing-parameter', ErrorCode.UNKNOWN_INTERNAL_PROBLEM],
])

const ErrorPage = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  let errorCode: string | undefined
  let errorId: string | undefined

  const excludeErrorId = [
    ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET,
    ErrorCode.TIMEOUT,
    ErrorCode.AUTHORIZATION_PROBLEM_SUBSCRIPTION,
  ]

  const shouldExcludeErrorId = () => {
    return excludeErrorId.some((code) => code.toString() === errorCode)
  }

  if (location.state) {
    const state = location.state as ErrorRoute
    errorCode = state.errorCode
    errorId = state.errorId
  }

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search)
      const reason = params.get('reason') ?? ''
      const errorCode = ReasonParamErrorCodeMap.get(reason) as ErrorCode
      dispatch(throwError({ type: ErrorType.ROUTE, errorCode }))
    }
  }, [dispatch, location.search])

  return (
    <Root>
      <AppHeader logo={logo} alt="Logo Webcert" banners={[<SystemBanners key="system-banners" />]} />
      <TextWrapper>
        <CenteredImageWithContent imgSrc={errorImage}>
          <DisplayError errorCode={errorCode} />
        </CenteredImageWithContent>
      </TextWrapper>
      {!shouldExcludeErrorId() && errorId && <ErrorCopyText errorId={errorId} />}
    </Root>
  )
}

export default ErrorPage
