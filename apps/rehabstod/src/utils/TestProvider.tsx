import { ReactNode } from 'react'
import { I18nProvider } from 'react-aria'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { store } from '../store/store'

export function TestProvider({ children }: { children: ReactNode }) {
  return (
    <I18nProvider locale="sv-SE">
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    </I18nProvider>
  )
}
