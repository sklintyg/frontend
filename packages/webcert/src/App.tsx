import React, { useEffect } from 'react'
import CertificatePage from './page/CertificatePage'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Welcome from './page/Welcome'
import 'inera-core-css/src/themes/inera-master.scss'
import { useAppDispatch } from './store/store'
import { getUser } from './store/user/userActions'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getUser())
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/certificate/:certificateId" render={() => <CertificatePage></CertificatePage>}></Route>
        <Route path="/welcome" render={() => <Welcome />}></Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
