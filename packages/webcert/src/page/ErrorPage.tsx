import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import AppHeader from '../components/AppHeader/AppHeader'
import DisplayError from '../components/error/DisplayError'
import { ErrorRoute } from '../components/error/ErrorComponent'
import ErrorCopyText from '../components/error/ErrorCopyText'
import logo from '../components/header/webcert_logo.png'
import CenteredImageWithContent from '../components/image/CenteredImageWithContent'
import SystemBanners from '../components/notification/SystemBanners'
import errorImage from '../images/fel-1.svg'
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
])

const ErrorPage: React.FC = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  let errorCode: string | undefined
  let errorId: string | undefined

  const excludeErrorId = [ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET, ErrorCode.TIMEOUT]

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
