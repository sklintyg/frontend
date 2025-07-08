import { ErrorBoundary } from 'react-error-boundary'
import { Outlet, Route, Routes } from 'react-router-dom'
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage'
import ErrorComponent from './components/error/ErrorComponent'
import SubscriptionWarningModal from './feature/subscription/SubscriptionWarningModal'
import { useNavigateEffect } from './hooks/useNavigateEffect'
import { CertificateDraftsPage } from './page/CertificateDraftsPage'
import CertificatePage from './page/CertificatePage'
import { CreatePageWithRedirect } from './page/CreatePage'
import ErrorPage from './page/ErrorPage'
import { SearchPageWithRedirect } from './page/SearchPage'
import { SelectUnitPage } from './page/SelectUnitPage'
import { SignedCertificatesPage } from './page/SignedCertificatesPage'
import { StartPage } from './page/StartPage'
import { UnhandledCertificatesPage } from './page/UnhandledCertificatesPage'
import Welcome from './page/Welcome'
import { throwError } from './store/error/errorActions'
import { createErrorRequest } from './store/error/errorCreator'
import { ErrorCode, ErrorType } from './store/error/errorReducer'
import { useAppDispatch } from './store/store'
import { LoggedInUserRedirect } from './utils/LoggedInUserRedirect'

export function Router() {
  useNavigateEffect()
  const dispatch = useAppDispatch()
  const onError = (error: Error) => {
    dispatch(
      throwError(
        createErrorRequest(ErrorType.ROUTE, ErrorCode.UNEXPECTED_ERROR, error.message, undefined, error.stack ? error.stack : undefined)
      )
    )
  }
  return (
    <Routes>
      <Route
        path="/"
        errorElement={<ErrorBoundary fallbackRender={ErrorMessage} onError={onError} />}
        element={
          <>
            <ErrorComponent />
            <SubscriptionWarningModal />
            <Outlet />
          </>
        }
      >
        <Route
          index
          element={
            <LoggedInUserRedirect>
              <StartPage />
            </LoggedInUserRedirect>
          }
        />
        <Route path="certificate/:certificateId/sign/:error" element={<CertificatePage />} />
        <Route path="certificate/:certificateId/launch-unit-selection" element={<SelectUnitPage />} />
        <Route path="certificate/:certificateId" element={<CertificatePage />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="welcome.html" element={<Welcome />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="error.jsp" element={<ErrorPage />} />
        <Route path="create/:patientId?" element={<CreatePageWithRedirect />} />
        <Route path="search" element={<SearchPageWithRedirect />} />
        <Route path="list/draft" element={<CertificateDraftsPage />} />
        <Route path="list/certificate" element={<SignedCertificatesPage />} />
        <Route path="list/unhandledcertificates" element={<UnhandledCertificatesPage />} />
      </Route>
    </Routes>
  )
}
