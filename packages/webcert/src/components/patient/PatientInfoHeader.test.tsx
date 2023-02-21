import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import store from '../../store/store'
import PatientInfoHeader from './PatientInfoHeader'
import { createPatient } from './patientTestUtils'

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
