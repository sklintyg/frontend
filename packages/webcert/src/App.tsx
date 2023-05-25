import { SpinnerBackdrop } from '@frontend/common'
import { ConnectedRouter } from 'connected-react-router'
import 'inera-core-css/dist/inera-master.css'
import { useEffect } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import ErrorComponent from './components/error/ErrorComponent'
import CareProviderModal from './feature/careProvider/CareProviderModal'
import WarningNormalOriginModal from './feature/certificate/Modals/WarningNormalOriginModal'
import SubscriptionWarningModal from './feature/subscription/SubscriptionWarningModal'
import CertificateDraftsPage from './page/CertificateDraftsPage'
import CertificatePage from './page/CertificatePage'
import { CreatePageWithRedirect } from './page/CreatePage'
import ErrorPage from './page/ErrorPage'
import { SearchPageWithRedirect } from './page/SearchPage'
import SignedCertificatesPage from './page/SignedCertificatesPage'
import { StartPageWithRedirect } from './page/StartPage'
import UnhandledCertificatesPage from './page/UnhandledCertificatesPage'
import Welcome from './page/Welcome'
import { history } from './store/configureApplicationStore'
import { throwError } from './store/error/errorActions'
import { createErrorRequest } from './store/error/errorCreator'
import { ErrorCode, ErrorType } from './store/error/errorReducer'
import { useAppDispatch } from './store/store'
import { cancelLogout, getUser, getUserStatistics, triggerLogout } from './store/user/userActions'
import { getAllDynamicLinks, getConfig } from './store/utils/utilsActions'
import { selectIsLoadingInitialState } from './store/utils/utilsSelectors'

const ErrorMessage = ({ error }: FallbackProps) => <>Ett fel har inträffat: {error.message}</>

function App(): JSX.Element {
  const dispatch = useAppDispatch()
  const isLoadingInitialState = useSelector(selectIsLoadingInitialState)

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
    <SpinnerBackdrop open={isLoadingInitialState} spinnerText="Laddar...">
      <ConnectedRouter history={history}>
        <ErrorBoundary fallbackRender={ErrorMessage} onError={onError}>
          <ErrorComponent />
          <CareProviderModal />
          <SubscriptionWarningModal />
          <WarningNormalOriginModal />
          <Switch>
            <Route path="/" exact render={() => <StartPageWithRedirect />} />
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
    </SpinnerBackdrop>
  )
}

export default App
