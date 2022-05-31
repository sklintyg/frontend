import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import React from 'react'
import reducer from '../store/reducers'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { StartPage } from './StartPage'
import { utilsMiddleware } from '../store/utils/utilsMiddleware'
import { updateConfig, updateIsLoadingConfig } from '../store/utils/utilsActions'
import { Configuration } from '../store/utils/utilsReducer'
import { MemoryRouter, Route } from 'react-router-dom'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/']}>
        <Route path="/">
          <StartPage />
        </Route>
      </MemoryRouter>
    </Provider>
  )
}

describe('StartPage', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, utilsMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should show loading info when config is loading', () => {
    renderComponent()
    testStore.dispatch(updateIsLoadingConfig(true))

    expect(screen.getByText('Laddar inloggningsalternativ...')).toBeInTheDocument()
  })

  it('should render idp links', () => {
    renderComponent()
    const config: Configuration = {
      version: '',
      banners: [],
      cgiFunktionstjansterIdpUrl: '#elegIdp',
      sakerhetstjanstIdpUrl: '#sithsIdp',
    }
    testStore.dispatch(updateConfig(config))

    expect(screen.getByText('SITHS-kort').closest('a')).toHaveAttribute('href', '/saml/login/alias/siths-wc2?idp=#sithsIdp')
    expect(screen.getByText('E-legitimation').closest('a')).toHaveAttribute('href', '/saml/login/alias/eleg-wc2?idp=#elegIdp')
  })
})
