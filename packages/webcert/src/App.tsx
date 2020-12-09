import React, { useState } from 'react'
import CertificatePage from './page/CertificatePage'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import { themeCreator } from './components/styles/theme'
import { CssBaseline, Switch as MuiSwitch } from '@material-ui/core'
import Brightness7Icon from '@material-ui/icons/Brightness7'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Welcome from './page/Welcome'
import { useDispatch } from 'react-redux'
import { getAllDynamicLinks } from './store/utils/utilsActions'

function App() {
  const dispatch = useDispatch()
  const [darkMode, setDarkMode] = useState(false)
  const handleThemeToggle = () => {
    setDarkMode(!darkMode)
  }
  const theme = themeCreator(darkMode)

  dispatch(getAllDynamicLinks)

  const themeToggler = (
    <MuiSwitch checkedIcon={<Brightness4Icon />} icon={<Brightness7Icon />} checked={darkMode} onClick={handleThemeToggle}></MuiSwitch>
  )

  return (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route path="/certificate/:id" render={() => <CertificatePage themeToggler={themeToggler}></CertificatePage>}></Route>
            <Route path="/welcome" render={() => <Welcome />}></Route>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </CssBaseline>
  )
}

export default App
