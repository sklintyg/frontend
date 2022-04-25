import React, { useEffect } from 'react'
import CertificatePage from './page/CertificatePage'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Welcome from './page/Welcome'
import 'inera-core-css/src/themes/inera-master.scss'
import 'inera-core-css/src/icons/inera/fontello/style.scss'
import { useAppDispatch } from './store/store'
import { cancelLogout, getUser, triggerLogout } from './store/user/userActions'
import ErrorComponent from './components/error/ErrorComponent'
import ErrorPage from './page/ErrorPage'
import { getAllDynamicLinks, getConfig, getStatistics } from './store/utils/utilsActions'
import { ErrorBoundary } from 'react-error-boundary'
import { throwError } from './store/error/errorActions'
import { createErrorRequest } from './store/error/errorCreator'
import { ErrorCode, ErrorType } from './store/error/errorReducer'
import { ListPageWithRedirect } from './page/ListPage'
import { ListType } from '@frontend/common/src/types/list'
import { SearchAndCreatePageWithRedirect } from './page/SearchAndCreatePage'
import { StartPageWithRedirect } from './page/StartPage'

function App(): JSX.Element {
  const dispatch = useAppDispatch()

  const handleWindowBeforeUnload = () => dispatch(triggerLogout())

  useEffect(() => {
    window.addEventListener('beforeunload', handleWindowBeforeUnload)
    dispatch(cancelLogout())
    dispatch(getUser())
    dispatch(getAllDynamicLinks())
    dispatch(getStatistics())
    dispatch(getConfig())
    return () => {
      window.removeEventListener('beforeunload', handleWindowBeforeUnload)
    }
  })

  const onError = (error: Error) => {
    dispatch(
      throwError(
        createErrorRequest(ErrorType.ROUTE, ErrorCode.UNEXPECTED_ERROR, error.message, undefined, error.stack ? error.stack : undefined)
      )
    )
  }

  return (
    <BrowserRouter>
      <ErrorBoundary fallbackRender={({ error }) => <>Ett fel har inträffat: {error.message}</>} onError={onError}>
        <ErrorComponent />
        <Switch>
          <Route path="/" exact render={() => <StartPageWithRedirect />} />
          <Route path="/certificate/:certificateId" render={() => <CertificatePage />} />
          <Route path="/welcome" render={() => <Welcome />} />
          <Route path="/error(.jsp)?" render={() => <ErrorPage />} />
          <Route path="/create/:patientId?" render={() => <SearchAndCreatePageWithRedirect />} />
          <Route path="/list/draft" render={() => <ListPageWithRedirect type={ListType.DRAFTS} />} />
          <Route path="/list/certificate" render={() => <ListPageWithRedirect type={ListType.CERTIFICATES} />} />
        </Switch>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
