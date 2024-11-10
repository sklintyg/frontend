import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router-dom'
import { vi } from 'vitest'
import { fakeCertificate, fakeCertificateMetaData } from '../faker'
import { fakeCertificateConfirmationModal } from '../faker/certificate/fakeCertificateConfirmationModal'
import { updateCertificate } from '../store/certificate/certificateActions'
import { configureApplicationStore } from '../store/configureApplicationStore'
import { throwError } from '../store/error/errorActions'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { ResourceLinkType } from '../types'
import CertificatePage from './CertificatePage'

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

  it('should show general confirm modal', async () => {
    const confirmationModal = fakeCertificateConfirmationModal()
    testStore.dispatch(
      updateCertificate(
        fakeCertificate({
          metadata: fakeCertificateMetaData({ confirmationModal }),
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

    expect(screen.getByText(confirmationModal.title)).toBeInTheDocument()
  })
})
