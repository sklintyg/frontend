import React, { useEffect } from 'react'
import CertificatePage from './page/CertificatePage'
import { Route, Switch } from 'react-router-dom'
import Welcome from './page/Welcome'
import 'inera-core-css/src/themes/inera-master.scss'
import 'inera-core-css/src/icons/inera/fontello/style.scss'
import { useAppDispatch } from './store/store'
import { cancelLogout, getUser, getUserStatistics, triggerLogout } from './store/user/userActions'
import ErrorComponent from './components/error/ErrorComponent'
import ErrorPage from './page/ErrorPage'
import { getAllDynamicLinks, getConfig } from './store/utils/utilsActions'
import { ErrorBoundary } from 'react-error-boundary'
import { throwError } from './store/error/errorActions'
import { createErrorRequest } from './store/error/errorCreator'
import { ErrorCode, ErrorType } from './store/error/errorReducer'
import { SearchAndCreatePageWithRedirect } from './page/SearchAndCreatePage'
import { StartPageWithRedirect } from './page/StartPage'
import { Backdrop } from '@frontend/common'
import { useSelector } from 'react-redux'
import { selectIsLoadingInitialState } from './store/utils/utilsSelectors'
import CareProviderModal from './feature/careProvider/CareProviderModal'
import SubscriptionWarningModal from './feature/subscription/SubscriptionWarningModal'
import WarningNormalOriginModal from './feature/certificate/Modals/WarningNormalOriginModal'
import CertificateDraftsPage from './page/CertificateDraftsPage'
import UnhandledCertificatesPage from './page/UnhandledCertificatesPage'
import SignedCertificatesPage from './page/SignedCertificatesPage'
import { ConnectedRouter } from 'connected-react-router'
import { history } from './store/configureApplicationStore'

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
    <Backdrop open={isLoadingInitialState} spinnerText="Laddar...">
      <ConnectedRouter history={history}>
        <ErrorBoundary fallbackRender={({ error }) => <>Ett fel har inträffat: {error.message}</>} onError={onError}>
          <ErrorComponent />
          <CareProviderModal />
          <SubscriptionWarningModal />
          <WarningNormalOriginModal />
          <Switch>
            <Route path="/" exact render={() => <StartPageWithRedirect />} />
            <Route path="/certificate/:certificateId" render={() => <CertificatePage />} />
            <Route path="/welcome" render={() => <Welcome />} />
            <Route path="/error(.jsp)?" render={() => <ErrorPage />} />
            <Route path="/create/:patientId?" render={() => <SearchAndCreatePageWithRedirect />} />
            <Route path="/list/draft" render={() => <CertificateDraftsPage />} />
            <Route path="/list/certificate" render={() => <SignedCertificatesPage />} />
            <Route path="/list/unhandledcertificates" render={() => <UnhandledCertificatesPage />} />
          </Switch>
        </ErrorBoundary>
      </ConnectedRouter>
    </Backdrop>
  )
}

export default App
