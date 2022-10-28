import React from 'react'
import { render, screen } from '@testing-library/react'
import { DeathCertificateConfirmModalIntegrated } from './DeathCertificateConfirmModalIntegrated'
import { createMemoryHistory } from 'history'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import * as redux from 'react-redux'
import { Router } from 'react-router-dom'
import reducer from '../../../store/reducers'
import { createPatient } from '../../../components/patient/patientTestUtils'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { errorMiddleware } from '../../../store/error/errorMiddleware'
import userEvent from '@testing-library/user-event'

const mockDispatchFn = jest.fn()
let testStore: EnhancedStore
const history = createMemoryHistory()
const PERSON_ID = '191212121212'
const setOpen = () => {
  return true
}

const renderComponent = (isOpen: boolean) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <DeathCertificateConfirmModalIntegrated
          patient={createPatient(PERSON_ID)}
          certificateId="certificateId"
          setOpen={setOpen}
          open={isOpen}
          history={history}
        />
      </Router>
    </Provider>
  )
}

describe('DeathCertificateConfirmModalIntegrated', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, errorMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should show modal if open is true', () => {
    renderComponent(true)
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('should not render when open is false', () => {
    renderComponent(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should display patients person id', () => {
    renderComponent(true)
    expect(screen.getByText(PERSON_ID, { exact: false })).toBeInTheDocument()
  })

  it('should display patients full name', () => {
    renderComponent(true)
    expect(screen.queryByText('firstName middleName lastName', { exact: false })).toBeInTheDocument()
  })

  it('should show button for delete', () => {
    renderComponent(true)
    expect(screen.getByText('Radera')).toBeInTheDocument()
  })

  it('should dispatch delete certificate on close', () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(mockDispatchFn)

    renderComponent(true)

    const deleteButton = screen.getByText('Radera')
    userEvent.click(deleteButton)
    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
  })

  it('should not close modal when clicking outside the modal', () => {
    renderComponent(true)
    userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  describe('Confirm button', () => {
    it('should show button for confirm', () => {
      renderComponent(true)
      expect(screen.getByText('Gå vidare')).toBeInTheDocument()
    })

    it('should disable confirm button when checkbox in not checked', () => {
      renderComponent(true)
      const confirmButton = screen.getByText('Gå vidare')

      expect(confirmButton)
      expect(confirmButton).toBeDisabled()
    })

    it('should enable confirm button when checkbox in checked', () => {
      renderComponent(true)
      const confirmCheckbox = screen.getByRole('checkbox')
      userEvent.click(confirmCheckbox)

      const confirmButton = screen.getByText('Gå vidare')
      expect(confirmButton).not.toBeDisabled()
    })
  })
})
