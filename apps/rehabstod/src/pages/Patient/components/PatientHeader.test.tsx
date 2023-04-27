import { screen } from '@testing-library/react'
import { fakePatient } from '../../../utils/fake/fakePatient'
import { PatientHeader } from './PatientHeader'
import { store } from '../../../store/store'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { updateShowPersonalInformation } from '../../CurrentSickLeaves/sickLeaveSlice'

describe('PatientHeader', () => {
  function renderPatientHeader(showPersonalInformation: boolean) {
    const patient = fakePatient({
      sjukfallList: [
        {
          intyg: [
            {
              start: '2023-04-25',
              slut: '2023-05-01',
              patient: {
                alder: 30,
                kon: 'Kvinna',
                namn: 'Olle',
                id: '123',
              },
            },
          ],
        },
      ],
    })
    store.dispatch(updateShowPersonalInformation(showPersonalInformation))
    renderWithRouter(<PatientHeader patient={patient} />)
  }

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
