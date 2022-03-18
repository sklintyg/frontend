import { render, screen } from '@testing-library/react'
import React from 'react'
import PatientInfoHeader from './PatientInfoHeader'
import { createPatient } from './patientTestUtils'
import { Provider } from 'react-redux'
import store from '../../store/store'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

const EXPECTED_PATIENT = createPatient('patientId')

const renderComponent = () => {
  render(
    <Provider store={store}>
      <Router history={createMemoryHistory()}>
        <PatientInfoHeader patient={EXPECTED_PATIENT} />
      </Router>
    </Provider>
  )
}

describe('PatientInfoHeader', () => {
  it('should render component', () => {
    renderComponent()
  })

  it('should show patient name', () => {
    renderComponent()
    expect(screen.getByText(EXPECTED_PATIENT.fullName, { exact: false })).toBeInTheDocument()
  })

  it('should show patient id', () => {
    renderComponent()
    expect(screen.getByText(EXPECTED_PATIENT.personId.id, { exact: false })).toBeInTheDocument()
  })

  it('should show switch patient button', () => {
    renderComponent()
    expect(screen.getByText('Byt patient')).toBeInTheDocument()
  })
})
