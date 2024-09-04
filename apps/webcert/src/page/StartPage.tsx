import type React from 'react'
import styled from 'styled-components'
import AppHeader from '../components/AppHeader/AppHeader'
import { UserHeaderMenu, UserHeaderMenuItem } from '../components/AppHeader/UserHeaderMenu'
import { WebcertFooter } from '../components/footer/WebcertFooter'
import SystemBanners from '../components/notification/SystemBanners'
import image from '../images/webcert_bild_react.png'
import logo from '../images/webcert_logo.png'
import { useAppSelector } from '../store/store'
import { getConfig, selectIsLoadingConfig } from '../store/utils/utilsSelectors'

const Root = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex-grow: 1;
`

const LoginButton = styled.a`
  display: flex;
  width: 13em;
  justify-content: space-between;
`

interface CreateAccountProps {
  url: string
}

const CreateAccount: React.FC<CreateAccountProps> = ({ url }) => (
  <div className="iu-text-right iu-mr-500">
    Är du privatläkare och vill använda Webcert?
    <br />
    <a href={url}>Skapa konto</a>
  </div>
)

export const StartPage: React.FC = () => {
  const config = useAppSelector(getConfig)
  const isLoadingConfig = useAppSelector(selectIsLoadingConfig)
  const sithsUrl = '/saml/login/alias/defaultAliasNormal?idp=' + config.sakerhetstjanstIdpUrl
  const elegUrl = '/saml/login/alias/eleg?idp=' + config.cgiFunktionstjansterIdpUrl

  return (
    <Root>
      <AppHeader
        logo={logo}
        alt="Webcert"
        secondaryUserMenu={
          <UserHeaderMenu>
            <UserHeaderMenuItem>
              <CreateAccount key="create-account" url={config.ppHost} />
            </UserHeaderMenuItem>
          </UserHeaderMenu>
        }
        banners={[<SystemBanners key="system-banners" />]}
      />
      <Content className="ic-container iu-mt-gutter iu-mb-gutter">
        <div className="iu-grid-cols iu-grid-cols-12">
          <div className="iu-grid-span-6">
            <img src={image} alt="Bärbar dator som är inloggad i Webcert" />
          </div>
          <div className="iu-grid-span-6">
            <h1 className="iu-mb-200">Välkommen till Webcert</h1>
            <p className="iu-mb-600">
              Webcert används för att utfärda digitala intyg. Här får du också överblick över dina patienters intyg. Du kan se aktuell
              status, historik och händelser i intygen. Dessutom kan du hantera all ärendekommunikation med mottagaren, till exempel
              Försäkringskassan.{' '}
            </p>
            <h2 className="iu-mb-1em">Välj inloggning</h2>
            {isLoadingConfig ? (
              <p>Laddar inloggningsalternativ...</p>
            ) : (
              <>
                <LoginButton className="ic-button ic-button--primary iu-mb-200" href={sithsUrl}>
                  <span>SITHS-kort</span> <span aria-hidden="true" className="icon-angle-right"></span>
                </LoginButton>
                <LoginButton className="ic-button ic-button--primary" href={elegUrl}>
                  <span>E-legitimation</span> <span aria-hidden="true" className="icon-angle-right"></span>
                </LoginButton>
              </>
            )}
          </div>
        </div>
      </Content>
      <WebcertFooter />
    </Root>
  )
}
