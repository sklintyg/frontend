import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
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
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

const config: Configuration = {
  version: '',
  banners: [],
  cgiFunktionstjansterIdpUrl: '#elegIdp',
  sakerhetstjanstIdpUrl: '#sithsIdp',
  ppHost: '#ppHostUrl',
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
    testStore.dispatch(updateIsLoadingConfig(true))
    renderComponent()

    expect(screen.getByText('Laddar inloggningsalternativ...')).toBeInTheDocument()
  })

  it('should render elegIdp link', () => {
    testStore.dispatch(updateConfig(config))
    renderComponent()

    expect(screen.getByRole('link', { name: 'SITHS-kort' })).toHaveAttribute('href', '/saml2/authenticate/sithsNormal')
  })

  it('should render sithsIdp link', () => {
    testStore.dispatch(updateConfig(config))
    renderComponent()

    expect(screen.getByRole('link', { name: 'E-legitimation' })).toHaveAttribute('href', '/saml2/authenticate/eleg')
  })

  it('should render ppHost link', () => {
    testStore.dispatch(updateConfig(config))
    renderComponent()

    expect(screen.getByRole('link', { name: 'Skapa konto' })).toHaveAttribute('href', '#ppHostUrl')
  })
})
