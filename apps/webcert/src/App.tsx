import { ConnectedRouter } from 'connected-react-router'
import 'inera-core-css/dist/inera-master.css'
import { useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Switch } from 'react-router-dom'
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage'
import ErrorComponent from './components/error/ErrorComponent'
import CareProviderModal from './feature/careProvider/CareProviderModal'
import SubscriptionWarningModal from './feature/subscription/SubscriptionWarningModal'
import CertificateDraftsPage from './page/CertificateDraftsPage'
import CertificatePage from './page/CertificatePage'
import { CreatePageWithRedirect } from './page/CreatePage'
import ErrorPage from './page/ErrorPage'
import { SearchPageWithRedirect } from './page/SearchPage'
import SignedCertificatesPage from './page/SignedCertificatesPage'
import { StartPage } from './page/StartPage'
import UnhandledCertificatesPage from './page/UnhandledCertificatesPage'
import Welcome from './page/Welcome'
import { history } from './store/configureApplicationStore'
import { throwError } from './store/error/errorActions'
import { createErrorRequest } from './store/error/errorCreator'
import { ErrorCode, ErrorType } from './store/error/errorReducer'
import { useAppDispatch } from './store/store'
import { cancelLogout, getUser, getUserStatistics, triggerLogout } from './store/user/userActions'
import { getAllDynamicLinks, getConfig } from './store/utils/utilsActions'
import { LoggedInUserRedirect } from './utils/LoggedInUserRedirect'

function App(): React.JSX.Element {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleWindowBeforeUnload = () => dispatch(triggerLogout())

    window.addEventListener('beforeunload', handleWindowBeforeUnload)
    dispatch(cancelLogout())
    dispatch(getUser())
    dispatch(getUserStatistics())
    dispatch(getAllDynamicLinks())
    dispatch(getConfig())
    return () => {
      window.removeEventListener('beforeunload', handleWindowBeforeUnload)
    }
  }, [dispatch])

  const onError = (error: Error) => {
    dispatch(
      throwError(
        createErrorRequest(ErrorType.ROUTE, ErrorCode.UNEXPECTED_ERROR, error.message, undefined, error.stack ? error.stack : undefined)
      )
    )
  }

  return (
    <ConnectedRouter history={history}>
      <ErrorBoundary fallbackRender={ErrorMessage} onError={onError}>
        <ErrorComponent />
        <CareProviderModal />
        <SubscriptionWarningModal />
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
      </ErrorBoundary>
    </ConnectedRouter>
  )
}

export default App
