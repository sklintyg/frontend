import { render } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import { EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { vi } from 'vitest'
import { configureApplicationStore } from '../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../store/test/dispatchHelperMiddleware'
import CertificatePage from './CertificatePage'
import { throwError } from '../store/error/errorActions'

let testStore: EnhancedStore
const history = createMemoryHistory()
history.replace = vi.fn()
describe('CertificatePage', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })
  it('renders an error message when error is set', () => {
    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={['/certificate/error}']}>
          <Route path="/certificate/:error">
            <CertificatePage />
          </Route>
        </MemoryRouter>
      </Provider>
    )

    expect(dispatchedActions.find((action) => throwError.match(action))).toBeDefined()
  })

  it('does not render an error message when error is not set', () => {
    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={['/certificate/error}']}>
          <Route path="/certificate/">
            <CertificatePage />
          </Route>
        </MemoryRouter>
      </Provider>
    )

    expect(dispatchedActions.find((action) => throwError.match(action))).not.toBeDefined()
  })
})
