import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from '@reduxjs/toolkit'
import { fakePatient } from '../../../utils/fake/fakePatient'
import { PatientHeader } from './PatientHeader'

describe('PatientHeader', () => {
  const patient = fakePatient()

  function renderPatientHeader(showPersonalInformation: boolean) {
    const initialState = { sickLeave: { showPersonalInformation } }
    const store = createStore(() => initialState)
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <PatientHeader patient={patient} />
        </MemoryRouter>
      </Provider>
    )
  }

  beforeEach(() => {
    patient.sjukfallList[0].intyg[0] = {
      ...patient.sjukfallList[0].intyg[0],
      start: '2023-04-25',
      slut: '2023-05-01',
      patient: {
        ...patient.sjukfallList[0].intyg[0].patient,
        alder: 30,
        kon: 'Kvinna',
        namn: 'Olle',
        id: '123',
      },
    }
  })

  it('Should render only age and gender if showPersonalInformation is false', async () => {
    renderPatientHeader(false)

    expect(screen.getByText(/30 år/i)).toBeInTheDocument()
    expect(screen.getByText(/Kvinna/i)).toBeInTheDocument()
  })

  it('Should render patient name, ID, age, and gender when showPersonalInformation is true', () => {
    renderPatientHeader(true)

    expect(screen.getByText(/Olle/i)).toBeInTheDocument()
    expect(screen.getByText(/123/i)).toBeInTheDocument()
    expect(screen.getByText(/30 år/i)).toBeInTheDocument()
    expect(screen.getByText(/Kvinna/i)).toBeInTheDocument()
    expect(screen.getByText(/Uppskattad dag i sjukfallet:/i)).toBeInTheDocument()
  })
})
