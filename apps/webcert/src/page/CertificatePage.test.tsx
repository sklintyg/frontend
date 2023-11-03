import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import { EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { vi } from 'vitest'
import { fakeCertificate, ResourceLinkType } from '@frontend/common'
import { configureApplicationStore } from '../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../store/test/dispatchHelperMiddleware'
import CertificatePage from './CertificatePage'
import { throwError } from '../store/error/errorActions'
import { updateCertificate } from '../store/certificate/certificateActions'

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

  it('should show modal when WARNING_DODSBEVIS_INTEGRATED resource link exists', async () => {
    testStore.dispatch(
      updateCertificate(
        fakeCertificate({
          links: [
            {
              type: ResourceLinkType.WARNING_DODSBEVIS_INTEGRATED,
              name: 'Name',
              description: '',
              enabled: true,
            },
          ],
        })
      )
    )

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={['/certificate/error}']}>
          <Route path="/certificate/">
            <CertificatePage />
          </Route>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Kontrollera namn och personnummer', { exact: false })).toBeInTheDocument()
  })

  it('should show confirm modal when WARNING_LUAENA_INTEGRATED resource link exists', async () => {
    testStore.dispatch(
      updateCertificate(
        fakeCertificate({
          links: [
            {
              type: ResourceLinkType.WARNING_LUAENA_INTEGRATED,
              name: 'Name',
              description: '',
              enabled: true,
            },
          ],
        })
      )
    )

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={['/certificate/error}']}>
          <Route path="/certificate/">
            <CertificatePage />
          </Route>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Kontrollera att du använder dig av rätt läkarutlåtande', { exact: false })).toBeInTheDocument()
  })
})
