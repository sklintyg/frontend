import 'inera-core-css/dist/inera-master.css'
import { useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import { Routes } from './Routes'
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage'
import ErrorComponent from './components/error/ErrorComponent'
import CareProviderModal from './feature/careProvider/CareProviderModal'
import SubscriptionWarningModal from './feature/subscription/SubscriptionWarningModal'
import { throwError } from './store/error/errorActions'
import { createErrorRequest } from './store/error/errorCreator'
import { ErrorCode, ErrorType } from './store/error/errorReducer'
import { useAppDispatch } from './store/store'
import { cancelLogout, triggerLogout } from './store/user/userActions'
import { initateApplication } from './store/welcome/welcomeActions'

function App(): JSX.Element {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleWindowBeforeUnload = () => dispatch(triggerLogout())

    window.addEventListener('beforeunload', handleWindowBeforeUnload)
    dispatch(cancelLogout())
    dispatch(initateApplication())
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
    <BrowserRouter>
      <ErrorBoundary fallbackRender={ErrorMessage} onError={onError}>
        <ErrorComponent />
        <CareProviderModal />
        <SubscriptionWarningModal />
        <Routes />
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
