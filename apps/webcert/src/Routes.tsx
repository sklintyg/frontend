import { Route, Switch } from 'react-router-dom'
import { useNavigateEffect } from './hooks/useNavigateEffect'
import CertificateDraftsPage from './page/CertificateDraftsPage'
import CertificatePage from './page/CertificatePage'
import { CreatePageWithRedirect } from './page/CreatePage'
import ErrorPage from './page/ErrorPage'
import { SearchPageWithRedirect } from './page/SearchPage'
import SignedCertificatesPage from './page/SignedCertificatesPage'
import { StartPage } from './page/StartPage'
import UnhandledCertificatesPage from './page/UnhandledCertificatesPage'
import Welcome from './page/Welcome'
import { LoggedInUserRedirect } from './utils/LoggedInUserRedirect'

export function Routes() {
  useNavigateEffect()

  return (
    <Switch>
      <Route
        path="/"
        exact
        render={() => (
          <LoggedInUserRedirect>
            <StartPage />
          </LoggedInUserRedirect>
        )}
      />
      <Route path="/certificate/:certificateId/sign/:error" render={() => <CertificatePage />} />
      <Route path="/certificate/:certificateId" render={() => <CertificatePage />} />
      <Route path="/welcome(.html)?" render={() => <Welcome />} />
      <Route path="/error(.jsp)?" render={() => <ErrorPage />} />
      <Route path="/create/:patientId?" render={() => <CreatePageWithRedirect />} />
      <Route path="/search" render={() => <SearchPageWithRedirect />} />
      <Route path="/list/draft" render={() => <CertificateDraftsPage />} />
      <Route path="/list/certificate" render={() => <SignedCertificatesPage />} />
      <Route path="/list/unhandledcertificates" render={() => <UnhandledCertificatesPage />} />
    </Switch>
  )
}
