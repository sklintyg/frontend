import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { fakePatient } from '../../faker'
import store from '../../store/store'
import PatientInfoHeader from './PatientInfoHeader'

const EXPECTED_PATIENT = fakePatient()

const renderComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <PatientInfoHeader patient={EXPECTED_PATIENT} />
      </MemoryRouter>
    </Provider>
  )
}

describe('PatientInfoHeader', () => {
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
