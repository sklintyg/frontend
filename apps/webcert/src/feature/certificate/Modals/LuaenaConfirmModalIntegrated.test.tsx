import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import * as redux from 'react-redux'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { vi } from 'vitest'
import { fakeCertificate, fakePatient } from '../../../faker'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { listenerMiddleware } from '../../../store/listenerMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { LuaenaConfirmModalIntegrated } from './LuaenaConfirmModalIntegrated'

const mockDispatchFn = vi.fn()
let testStore: EnhancedStore
const history = createMemoryHistory()
const patient = fakePatient()
const setOpen = () => true

const renderComponent = (isOpen: boolean) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <LuaenaConfirmModalIntegrated certificateId="certificateId" setOpen={setOpen} open={isOpen} />
      </Router>
    </Provider>
  )
}

describe('LuaenaConfirmModalIntegrated', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([listenerMiddleware, dispatchHelperMiddleware, certificateMiddleware])
    testStore.dispatch(updateCertificate(fakeCertificate({ metadata: { patient } })))
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should show modal if open is true', () => {
    renderComponent(true)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should not render when open is false', () => {
    renderComponent(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should display patients person id', () => {
    renderComponent(true)
    expect(screen.getByText(patient.personId.id, { exact: false })).toBeInTheDocument()
  })

  it('should display patients full name', () => {
    renderComponent(true)
    expect(screen.getByText(patient.fullName, { exact: false })).toBeInTheDocument()
  })

  it('should show button for delete', () => {
    renderComponent(true)
    expect(screen.getByText('Radera')).toBeInTheDocument()
  })

  it('should dispatch delete certificate on close', async () => {
    const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(mockDispatchFn)

    renderComponent(true)

    const deleteButton = screen.getByText('Radera')
    await userEvent.click(deleteButton)
    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
  })

  it('should not close modal when clicking outside the modal', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByTestId('modal-backdrop'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  describe('Confirm button', () => {
    it('should show button for confirm', () => {
      renderComponent(true)
      expect(screen.getByText('Gå vidare')).toBeInTheDocument()
    })

    it('should disable confirm button when checkbox in not checked', async () => {
      renderComponent(true)
      const confirmButton = screen.getByText('Gå vidare')

      await expect(confirmButton).toBeDisabled()
    })

    it('should enable confirm button when checkbox in checked', async () => {
      renderComponent(true)
      const confirmCheckbox = screen.getByRole('checkbox')
      await userEvent.click(confirmCheckbox)

      const confirmButton = screen.getByText('Gå vidare')
      await expect(confirmButton).toBeEnabled()
    })
  })
})
