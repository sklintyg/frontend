import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ppApi } from '../../store/pp/ppApi'
import { updateField as updateStep01Field } from '../../store/pp/ppStep01ReducerSlice'
import { updateField as updateStep02Field } from '../../store/pp/ppStep02ReducerSlice'
import store from '../../store/store'
import { PPRegistrationPreview } from './PPRegistrationPreview'

let fakeAxios: MockAdapter

const renderComponent = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/register/granska']}>
        <Routes>
          <Route path="/register/granska" element={<PPRegistrationPreview />} />
          <Route path="/register/done" element={<div data-testid="step-05">Step 5</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

describe('PPRegistrationStep04', () => {
  beforeEach(async () => {
    fakeAxios = new MockAdapter(axios)
    fakeAxios.onGet('/api/private-practitioner/hospInformation').reply(200, {
      personalPrescriptionCode: 'HOSP-2025-789456',
      licensedHealthcareProfessions: [{ code: 'MD', description: 'Medical Doctor' }],
      specialities: [{ code: 'CAR', description: 'Cardiology' }],
    })
    await store.dispatch(ppApi.endpoints.getHOSPInformation.initiate())

    store.dispatch(updateStep01Field({ field: 'position', value: 'Specialist' }))
    store.dispatch(updateStep01Field({ field: 'careUnitName', value: 'Test Clinic' }))
    store.dispatch(updateStep01Field({ field: 'typeOfCare', value: 'Öppenvard' }))
    store.dispatch(updateStep01Field({ field: 'healthcareServiceType', value: 'Medicinsk Verksamhet' }))
    store.dispatch(updateStep01Field({ field: 'workplaceCode', value: '' }))

    store.dispatch(updateStep02Field({ field: 'phoneNumber', value: '123123' }))
    store.dispatch(updateStep02Field({ field: 'email', value: 'email@test.se' }))
    store.dispatch(updateStep02Field({ field: 'emailRepeat', value: 'email@test.se' }))
    store.dispatch(updateStep02Field({ field: 'address', value: 'Bestvägen 12' }))
    store.dispatch(updateStep02Field({ field: 'zipCode', value: '12345' }))
    store.dispatch(updateStep02Field({ field: 'city', value: 'Köping' }))
    store.dispatch(updateStep02Field({ field: 'municipality', value: 'Test123' }))
    store.dispatch(updateStep02Field({ field: 'county', value: 'Gasdfef' }))
  })

  it('Should display error when registration fails', async () => {
    fakeAxios.onPost('/api/private-practitioner/register-private-practitioner').reply(400)

    const user = userEvent.setup()

    renderComponent()

    await user.click(screen.getByRole('button', { name: 'Skapa konto' }))

    await waitFor(() => {
      expect(screen.getByText(/ett tekniskt fel har uppstått/i)).toBeInTheDocument()
    })
  })

  it('Should create account when ready', async () => {
    const requestSpy = vi.fn(() => [200, {}])
    fakeAxios.onPost('/api/private-practitioner/register-private-practitioner').reply(requestSpy)
    const user = userEvent.setup()

    renderComponent()

    await user.click(screen.getByRole('button', { name: 'Skapa konto' }))

    expect(requestSpy).toHaveBeenCalled()

    await waitFor(() => {
      expect(screen.getByTestId('step-05')).toBeInTheDocument()
    })
  })
})
