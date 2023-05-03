import { faker } from '@faker-js/faker'
import { screen } from '@testing-library/react'
import { format } from 'date-fns'
import { store } from '../../../store/store'
import { fakePatient } from '../../../utils/fake/fakePatient'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { updateShowPersonalInformation } from '../../CurrentSickLeaves/sickLeaveSlice'
import { PatientHeader } from './PatientHeader'

describe('PatientHeader', () => {
  function renderPatientHeader(showPersonalInformation: boolean) {
    const patient = fakePatient({
      sjukfallList: [
        {
          start: format(faker.date.past(1), 'yyyy-MM-dd'),
          dagar: 72,
          intyg: [
            {
              start: '2023-04-25',
              slut: '2023-05-01',
              patient: {
                alder: 30,
                kon: 'F',
                namn: 'Olle',
                id: '1212121212',
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

    expect(screen.queryByText(/olle/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/1212121212/i)).not.toBeInTheDocument()
    expect(screen.getByText(/30 år/i)).toBeInTheDocument()
    expect(screen.getByText(/kvinna/i)).toBeInTheDocument()
  })

  it('Should render patient name, ID, age, and gender when showPersonalInformation is true', () => {
    renderPatientHeader(true)

    expect(screen.getByText(/olle/i)).toBeInTheDocument()
    expect(screen.getByText(/1212121212/i)).toBeInTheDocument()
    expect(screen.getByText(/30 år/i)).toBeInTheDocument()
    expect(screen.getByText(/kvinna/i)).toBeInTheDocument()
    expect(screen.getByText(/uppskattad dag i sjukfallet:/i)).toBeInTheDocument()
  })
})
