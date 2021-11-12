import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { AppHeader } from '@frontend/common'
import styled from 'styled-components/macro'
import logo from '../components/header/webcert_logo.png'
import { AUTHORIZATION_PROBLEM, TIMEOUT } from '../store/error/errorReducer'
import CenteredImageWithContent from '../components/image/CenteredImageWithContent'
import errorImage from '../images/fel-1.svg'
import WCDynamicLink from '../components/utils/WCDynamicLink'

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
  const errorCode = location.state as string

  const getContent = () => {
    switch (errorCode) {
      case TIMEOUT:
        return (
          <>
            <strong>Du är utloggad</strong>
            <p>
              Du har blivit utloggad från Webcert på grund av inaktivitet. Om du vill fortsätta använda Webcert behöver du öppna intyget
              från journalsystemet.{' '}
            </p>
          </>
        )
      case AUTHORIZATION_PROBLEM:
        return (
          <>
            <strong>Behörighet saknas</strong>
            <p>
              Du saknar behörighet för att komma åt utkastet. För att få hjälp, kontakta i första hand din lokala IT-avdelning och i andra
              hand <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.{' '}
            </p>
          </>
        )
    }
  }

  return (
    <Root>
      <AppHeader logo={logo} alt={'Logo Webcert'} />
      <TextWrapper>
        <CenteredImageWithContent imgSrc={errorImage}>{getContent()}</CenteredImageWithContent>
      </TextWrapper>
    </Root>
  )
}

export default ErrorPage
