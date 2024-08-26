import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router-dom'
import { configureApplicationStore } from '../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateConfig, updateIsLoadingConfig } from '../store/utils/utilsActions'
import { utilsMiddleware } from '../store/utils/utilsMiddleware'
import type { Configuration } from '../store/utils/utilsReducer'
import { StartPage } from './StartPage'

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

const config: Configuration = {
  version: '',
  banners: [],
  cgiFunktionstjansterIdpUrl: '#elegIdp',
  sakerhetstjanstIdpUrl: '#sithsIdp',
  ppHost: '',
  forwardDraftOrQuestionUrl: '',
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

  it('should render elegIdp link', () => {
    renderComponent()
    testStore.dispatch(updateConfig(config))

    return expect(screen.getByRole('link', { name: 'SITHS-kort' })).toHaveAttribute(
      'href',
      '/saml/login/alias/defaultAliasNormal?idp=#sithsIdp'
    )
  })

  it('should render sithsIdp link', () => {
    renderComponent()
    testStore.dispatch(updateConfig(config))

    return expect(screen.getByRole('link', { name: 'E-legitimation' })).toHaveAttribute('href', '/saml/login/alias/eleg?idp=#elegIdp')
  })
})
