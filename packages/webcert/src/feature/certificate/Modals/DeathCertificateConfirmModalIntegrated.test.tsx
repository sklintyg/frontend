import React from 'react'
import { render, screen } from '@testing-library/react'
import { DeathCertificateConfirmModalIntegrated } from './DeathCertificateConfirmModalIntegrated'
import { createMemoryHistory } from 'history'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import reducer from '../../../store/reducers'
import { createPatient } from '../../../components/patient/patientTestUtils'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { errorMiddleware } from '../../../store/error/errorMiddleware'

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
})
