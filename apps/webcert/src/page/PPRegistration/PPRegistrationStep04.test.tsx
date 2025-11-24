import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { updateField as updateStep01Field } from '../../store/pp/ppStep01ReducerSlice'
import { updateField as updateStep02Field } from '../../store/pp/ppStep02ReducerSlice'
import store from '../../store/store'
import { PPRegistrationStep04 } from './PPRegistrationStep04'

let fakeAxios: MockAdapter

const renderComponent = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/register/step-4']}>
        <Routes>
          <Route path="/register/step-4" element={<PPRegistrationStep04 />} />
          <Route path="/register/done" element={<div data-testid="step-05">Step 5</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

describe('PPRegistrationStep04', () => {
  beforeEach(async () => {
    fakeAxios = new MockAdapter(axios)
    store.dispatch(updateStep01Field({ field: 'personId', value: '19901010-1234' }))
    store.dispatch(updateStep01Field({ field: 'name', value: 'Test User' }))
    store.dispatch(updateStep01Field({ field: 'occupation', value: 'Överlakare' }))
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

  it('Should render as expected', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('Should create account when ready', async () => {
    const user = userEvent.setup()

    renderComponent()

    await user.click(screen.getByRole('button', { name: 'Skapa konto' }))

    await waitFor(() => {
      expect(screen.getByTestId('step-05')).toBeInTheDocument()
    })
  })
})
