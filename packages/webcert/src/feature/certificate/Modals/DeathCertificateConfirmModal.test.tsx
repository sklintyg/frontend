import React from 'react'
import { render, screen } from '@testing-library/react'
import { DeathCertificateConfirmModal } from './DeathCertificateConfirmModal'
import { createMemoryHistory } from 'history'
import { EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import * as redux from 'react-redux'
import { Router } from 'react-router-dom'
import { createPatient } from '../../../components/patient/patientTestUtils'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { errorMiddleware } from '../../../store/error/errorMiddleware'
import userEvent from '@testing-library/user-event'
import { configureApplicationStore } from '../../../store/configureApplicationStore'

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
        <DeathCertificateConfirmModal patient={createPatient(PERSON_ID)} setOpen={setOpen} open={isOpen} />
      </Router>
    </Provider>
  )
}

describe('DeathCertificateConfirmModal', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, errorMiddleware])
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
})

describe('Confirm button', () => {
  it('should show button to proceed', () => {
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

  it('should dispatch create new certificate on proceed', () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(mockDispatchFn)

    renderComponent(true)

    const confirmCheckbox = screen.getByRole('checkbox')
    userEvent.click(confirmCheckbox)

    const confirmButton = screen.getByText('Gå vidare')
    userEvent.click(confirmButton)
    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
  })
})

describe('Cancel button', () => {
  it('should show button to cancel', () => {
    renderComponent(true)
    expect(screen.getByText('Avbryt')).toBeInTheDocument()
  })

  it('Cancelling shall not create certificate', () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(mockDispatchFn)

    renderComponent(true)
    const cancelButton = screen.getByText('Avbryt')
    userEvent.click(cancelButton)

    expect(mockDispatchFn).toHaveBeenCalledTimes(0)
  })
})
