import React, { useEffect } from 'react'
import CertificatePage from './page/CertificatePage'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Welcome from './page/Welcome'
import 'inera-core-css/src/themes/inera-master.scss'
import { useAppDispatch } from './store/store'
import { cancelLogout, getUser, triggerLogout } from './store/user/userActions'
import ErrorComponent from './components/error/ErrorComponent'
import ErrorPage from './page/ErrorPage'
import { getAllDynamicLinks } from './store/utils/utilsActions'

function App(): JSX.Element {
  const dispatch = useAppDispatch()

  const handleWindowBeforeUnload = () => dispatch(triggerLogout())

  useEffect(() => {
    window.addEventListener('beforeunload', handleWindowBeforeUnload)
    dispatch(cancelLogout())
    dispatch(getUser())
    dispatch(getAllDynamicLinks())
    return () => {
      window.removeEventListener('beforeunload', handleWindowBeforeUnload)
    }
  })

  return (
    <BrowserRouter>
      <ErrorComponent />
      <Switch>
        <Route path="/certificate/:certificateId" render={() => <CertificatePage />} />
        <Route path="/welcome" render={() => <Welcome />} />
        <Route path={'/error'} render={() => <ErrorPage />} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
