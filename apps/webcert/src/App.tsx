import 'inera-core-css/dist/inera-master.css'
import { useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { useAppDispatch, useAppSelector } from './store/store'
import { cancelLogout, triggerLogout } from './store/user/userActions'
import { getUser } from './store/user/userSelectors'
import { initateApplication } from './store/welcome/welcomeActions'

function App(): JSX.Element {
  const dispatch = useAppDispatch()
  const origin = useAppSelector((state) => getUser(state)?.origin)

  useEffect(() => {
    if (origin == 'DJUPINTEGRATION') {
      const handleWindowBeforeUnload = () => dispatch(triggerLogout())
      window.addEventListener('beforeunload', handleWindowBeforeUnload)
      dispatch(cancelLogout())
      dispatch(initateApplication())
      return () => {
        window.removeEventListener('beforeunload', handleWindowBeforeUnload)
      }
    }
    dispatch(initateApplication())
  }, [dispatch, origin])

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

export default App
