import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router-dom'
import { expect, it, describe, beforeEach, afterEach } from 'vitest'
import { StartPage } from './StartPage'
import { configureApplicationStore } from '../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateConfig, updateIsLoadingConfig } from '../store/utils/utilsActions'
import { utilsMiddleware } from '../store/utils/utilsMiddleware'
import { Configuration } from '../store/utils/utilsReducer'

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
    testStore = configureApplicationStore([dispatchHelperMiddleware, utilsMiddleware])
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
      ppHost: '',
    }
    testStore.dispatch(updateConfig(config))

    expect(screen.getByRole('link', { name: 'SITHS-kort' })).toHaveAttribute('href', '/saml/login/alias/siths-wc2?idp=#sithsIdp')
    expect(screen.getByRole('link', { name: 'E-legitimation' })).toHaveAttribute('href', '/saml/login/alias/eleg-wc2?idp=#elegIdp')
  })
})
