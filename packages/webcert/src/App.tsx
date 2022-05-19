import React, { useEffect } from 'react'
import CertificatePage from './page/CertificatePage'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
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
import { ListType } from '@frontend/common/src/types/list'
import { SearchAndCreatePageWithRedirect } from './page/SearchAndCreatePage'
import { StartPageWithRedirect } from './page/StartPage'
import { ListPageWithRedirect } from './page/ListPage'
import { Backdrop, PopUpModal } from '@frontend/common'
import { useSelector } from 'react-redux'
import { selectIsLoadingInitialState } from './store/utils/utilsSelectors'
import { CareProviderModalContent } from './feature/modal/CareProviderModalContent'
import { getUser as selectUser } from './store/user/userSelectors'

function App(): JSX.Element {
  const dispatch = useAppDispatch()
  const isLoadingInitialState = useSelector(selectIsLoadingInitialState)
  const user = useSelector(selectUser)

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

  const showCareProviderModal = !!user && !user?.loggedInUnit.unitId

  return (
    <Backdrop open={isLoadingInitialState} spinnerText="Laddar...">
      <BrowserRouter>
        <ErrorBoundary fallbackRender={({ error }) => <>Ett fel har inträffat: {error.message}</>} onError={onError}>
          <ErrorComponent />
          <PopUpModal modalTitle="Välj vårdgivare" open={showCareProviderModal}>
            <CareProviderModalContent />
          </PopUpModal>
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
    </Backdrop>
  )
}

export default App
