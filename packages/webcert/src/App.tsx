import React from 'react'
import CertificatePage from './page/CertificatePage'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Welcome from './page/Welcome'
import 'inera-core-css/src/themes/inera-master.scss'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/certificate/:id" render={() => <CertificatePage></CertificatePage>}></Route>
        <Route path="/welcome" render={() => <Welcome />}></Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
