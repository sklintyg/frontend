/* eslint-disable import/no-duplicates */
import { IDSSpinner } from '@inera/ids-react'
import { setDefaultOptions } from 'date-fns'
import { sv } from 'date-fns/locale'
import React from 'react'
import { I18nProvider } from 'react-aria'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import './index.css'
import { router } from './router'
import { persistor, store } from './store/store'

if (import.meta.env.MODE === 'development' && import.meta.env.VITE_USE_MOCKS === 'true') {
  const { worker } = await import('./mocks/browser')
  worker.start()
}

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
