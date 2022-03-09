import React from 'react'
import { AppHeader, CustomButton, Footer, InfoBox } from '@frontend/common'
import logo from '../components/header/webcert_logo.png'
import image from '../images/webcert_bild3_fmb@1x.jpg'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { getConfig } from '../store/utils/utilsSelectors'

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
  border: 1px solid #01a5a3;
  background-color: #fff;
  color: #01a5a3;
  border-radius: 0.1875rem;
  padding: 0.45rem 1rem;
  text-decoration: none;
`

const CreateAccount: React.FC = () => (
  <AlignRight>
    Är du privatläkare och vill använda Webcert?
    <br />
    <a href="#">Skapa konto</a>
  </AlignRight>
)

export const StartPage: React.FC = () => {
  const config = useSelector(getConfig)
  const sithsUrl = '/saml/login/alias/defaultAlias?idp=' + config.sakerhetstjanstIdpUrl
  const elegUrl = '/saml/login/alias/eleg?idp=' + config.cgiFunktionstjansterIdpUrl

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
            <LoginButton className="iu-mb-200" href={sithsUrl}>
              <span>SITHS-kort</span> <span aria-hidden="true" className="icon-angle-right"></span>
            </LoginButton>
            <LoginButton href={elegUrl}>
              <span>E-legitimation</span> <span aria-hidden="true" className="icon-angle-right"></span>
            </LoginButton>
          </div>
        </div>
      </Content>
      <Footer />
    </Root>
  )
}
