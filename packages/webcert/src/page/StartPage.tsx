import React from 'react'
import { AppHeader, Footer, InfoBox } from '@frontend/common'
import logo from '../components/header/webcert_logo.png'
import image from '../images/webcert_bild3_fmb@1x.jpg'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { getConfig } from '../store/utils/utilsSelectors'
import { withLoggedInUserRedirect } from '../utils/withLoggedInUserRedirect'

const Root = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex-grow: 1;
`

const AlignRight = styled.div`
  text-align: right;
`

const LoginButton = styled.a`
  display: flex;
  width: 13em;
  justify-content: space-between;
`

const CreateAccount: React.FC = () => (
  <AlignRight>
    Är du privatläkare och vill använda Webcert?
    <br />
    <a href="#">Skapa konto</a>
  </AlignRight>
)

const StartPage: React.FC = () => {
  const config = useSelector(getConfig)
  const sithsUrl = '/saml/login/alias/siths-wc2?idp=' + config.sakerhetstjanstIdpUrl
  const elegUrl = '/saml/login/alias/eleg-wc2?idp=' + config.cgiFunktionstjansterIdpUrl

  return (
    <Root>
      <AppHeader logo={logo} alt="Logo Webcert" secondaryItems={[<CreateAccount />]} />
      <Content className="ic-container iu-mt-gutter iu-mb-gutter">
        <div className="iu-grid-cols iu-grid-cols-12">
          <div className="iu-grid-span-6">
            <img src={image} />
          </div>
          <div className="iu-grid-span-6">
            <h1 className="iu-mb-200">Välkommen till Webcert</h1>
            <p className="iu-mb-600">
              Webcert används för att utfärda digitala intyg. Här får du också överblick över dina patienters intyg. Du kan se aktuell
              status, historik och händelser i intygen. Dessutom kan du hantera all ärendekommunikation med mottagaren, till exempel
              Försäkringskassan.
            </p>
            <h2>Välj inloggning</h2>
            <InfoBox type="info" additionalStyles="iu-mb-1em iu-mt-1em">
              Har du Telia e-legitimation rekommenderas webbläsaren Internet Explorer 11.
            </InfoBox>
            <LoginButton className="ic-button ic-button--secondary iu-mb-200" href={sithsUrl}>
              <span>SITHS-kort</span> <span aria-hidden="true" className="icon-angle-right"></span>
            </LoginButton>
            <LoginButton className="ic-button ic-button--secondary" href={elegUrl}>
              <span>E-legitimation</span> <span aria-hidden="true" className="icon-angle-right"></span>
            </LoginButton>
          </div>
        </div>
      </Content>
      <Footer />
    </Root>
  )
}

export const StartPageWithRedirect = withLoggedInUserRedirect(StartPage)
