import { screen } from '@testing-library/react'
import { addDays, format, subDays } from 'date-fns'
import { updateShowPersonalInformation } from '../../../store/slices/settings.slice'
import { store } from '../../../store/store'
import { fakePatient } from '../../../utils/fake/fakePatient'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { PatientHeader } from './PatientHeader'

describe('PatientHeader', () => {
  function renderPatientHeader(showPersonalInformation: boolean) {
    const patient = fakePatient({
      sjukfallList: [
        {
          start: format(subDays(Date.now(), 10), 'yyyy-MM-dd'),
          slut: format(addDays(Date.now(), 20), 'yyyy-MM-dd'),
          dagar: 30,
          intyg: [
            {
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

  it('should show days into sick leave as first active sick leave start date minus todays date', () => {
    renderPatientHeader(true)
    expect(screen.getByText('10 dagar')).toBeInTheDocument()
  })

  it('Should display header even if there is no current sickleave', () => {
    const patient = fakePatient({
      sjukfallList: [
        {
          start: format(subDays(new Date('2012-12-12'), 10), 'yyyy-MM-dd'),
          slut: format(addDays(new Date('2012-12-12'), 20), 'yyyy-MM-dd'),
          intyg: [
            {
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
    store.dispatch(updateShowPersonalInformation(true))
    renderWithRouter(<PatientHeader patient={patient} />)

    expect(screen.getByText(/olle/i)).toBeInTheDocument()
    expect(screen.getByText(/1212121212/i)).toBeInTheDocument()
    expect(screen.getByText(/30 år/i)).toBeInTheDocument()
    expect(screen.getByText(/kvinna/i)).toBeInTheDocument()
    expect(screen.queryByText(/uppskattad dag i sjukfallet:/i)).not.toBeInTheDocument()
  })
})
