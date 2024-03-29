/* eslint-disable import/order */
import { setDefaultOptions } from 'date-fns'
import { sv } from 'date-fns/locale'
import React from 'react'
import { I18nProvider } from 'react-aria'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'
import { persistor, store } from './store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { IDSSpinner } from '@frontend/ids-react-ts'

setDefaultOptions({ locale: sv })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nProvider locale="sv-SE">
      <Provider store={store}>
        <PersistGate loading={<IDSSpinner />} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </I18nProvider>
  </React.StrictMode>
)
