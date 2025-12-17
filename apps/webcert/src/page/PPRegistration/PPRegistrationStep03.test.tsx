import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ppApi } from '../../store/pp/ppApi'
import store from '../../store/store'
import { PPRegistrationStep03 } from './PPRegistrationStep03'

let fakeAxios: MockAdapter

const renderComponent = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/register/steg-3']}>
        <Routes>
          <Route path="/register/steg-3" element={<PPRegistrationStep03 />} />
          <Route path="/register/granska" element={<div data-testid="step-04">Step 4</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

describe('PPRegistrationStep03', () => {
  beforeEach(async () => {
    fakeAxios = new MockAdapter(axios)
  })

  it('Should display HOSP information', async () => {
    fakeAxios.onGet('/api/private-practitioner/hospInformation').reply(200, {
      personalPrescriptionCode: 'HOSP-2025-789456',
      licensedHealthcareProfessions: [
        {
          code: 'MD',
          description: 'Medical Doctor',
        },
        {
          code: 'RN',
          description: 'Registered Nurse',
        },
        {
          code: 'PT',
          description: 'Physical Therapist',
        },
      ],
      specialities: [
        {
          code: 'CAR',
          description: 'Cardiology',
        },
        {
          code: 'PED',
          description: 'Pediatrics',
        },
        {
          code: 'ORTH',
          description: 'Orthopedics',
        },
        {
          code: 'NEU',
          description: 'Neurology',
        },
      ],
    })
    await store.dispatch(ppApi.endpoints.getHOSPInformation.initiate())

    renderComponent()

    expect(screen.getByLabelText('Legitimerad yrkesgrupp')).toHaveValue('Medical Doctor, Registered Nurse, Physical Therapist')
    expect(screen.getByLabelText('Specialitet')).toHaveValue('Cardiology, Pediatrics, Orthopedics, Neurology')
    expect(screen.getByLabelText('Förskrivarkod')).toHaveValue('HOSP-2025-789456')
  })

  it('Should have fallback values when request fails', async () => {
    await store.dispatch(ppApi.endpoints.getHOSPInformation.initiate())
    renderComponent()

    await waitFor(() => expect(screen.getByLabelText('Legitimerad yrkesgrupp')).toHaveValue('Inga uppgifter hämtade'))
    expect(screen.getByLabelText('Specialitet')).toHaveValue('Inga uppgifter hämtade')
    expect(screen.getByLabelText('Förskrivarkod')).toHaveValue('Inga uppgifter hämtade')
  })

  it('should navigate to next step when form is valid', async () => {
    const user = userEvent.setup()

    renderComponent()

    await waitFor(() => expect(screen.getByLabelText('Legitimerad yrkesgrupp')).toHaveValue('Inga uppgifter hämtade'))

    await user.click(screen.getByRole('button', { name: 'Granska uppgifter' }))

    await waitFor(() => {
      expect(screen.getByTestId('step-04')).toBeInTheDocument()
    })
  })

  it('Should populate fields when HOSP information is missing', async () => {
    fakeAxios.onGet('/api/private-practitioner/hospInformation').reply(200, {
      personalPrescriptionCode: null,
      licensedHealthcareProfessions: [],
      specialities: [],
    })

    await store.dispatch(ppApi.endpoints.getHOSPInformation.initiate())

    renderComponent()

    expect(screen.getByLabelText('Legitimerad yrkesgrupp')).toHaveValue('Inga uppgifter hämtade')
    expect(screen.getByLabelText('Specialitet')).toHaveValue('Inga uppgifter hämtade')
    expect(screen.getByLabelText('Förskrivarkod')).toHaveValue('Inga uppgifter hämtade')
  })
})
