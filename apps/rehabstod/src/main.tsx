/* eslint-disable import/order */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './index.css'
import { store } from './store/store'
import { setDefaultOptions } from 'date-fns'
import { sv } from 'date-fns/locale'

setDefaultOptions({ locale: sv })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
