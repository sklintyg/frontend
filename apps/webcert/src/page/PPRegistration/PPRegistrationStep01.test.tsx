import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fakeUser } from '../../faker'
import { ppApi } from '../../store/pp/ppApi'
import { resetForm, updateField, validateData } from '../../store/pp/ppStep01ReducerSlice'
import store from '../../store/store'
import { updateIsLoadingUser, updateUser } from '../../store/user/userActions'
import { PPRegistrationStep01 } from './PPRegistrationStep01'

const mockPPConfig = {
  positions: [
    { code: 'overlakare', description: 'Överläkare' },
    { code: 'distrikts_specialist_allmenmedicin', description: 'Distriktsläkare/Specialist allmänmedicin' },
    { code: 'skollakare', description: 'Skolläkare' },
  ],
  typeOfCare: [
    { code: 'hemsjukvard', description: 'Hemsjukvård' },
    { code: 'oppenvard', description: 'Öppenvård' },
    { code: 'slutenvard', description: 'Slutenvård' },
  ],
  healthcareServiceTypes: [
    { code: 'barn_ungdomsverksamhet', description: 'Barn- och ungdomsverksamhet' },
    { code: 'medicinsk_verksamhet', description: 'Medicinsk verksamhet' },
    { code: 'laboratorieverksamhet', description: 'Laboratorieverksamhet' },
  ],
}

let fakeAxios: MockAdapter

const renderComponent = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/register/step-1']}>
        <Routes>
          <Route path="/register/step-1" element={<PPRegistrationStep01 />} />
          <Route path="/register/step-2" element={<div data-testid="step-02">Step 2</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

describe('PPRegistrationStep01', () => {
  beforeEach(async () => {
    fakeAxios = new MockAdapter(axios)
    fakeAxios.onGet('/api/private-practitioner/config').reply(200, mockPPConfig)
    await store.dispatch(ppApi.endpoints.getPPConfig.initiate())
    store.dispatch(
      updateUser(
        fakeUser({
          personId: '19730906-9289',
          name: 'Frida Kranstege',
        })
      )
    )
    store.dispatch(updateIsLoadingUser(false))
  })

  afterEach(() => {
    fakeAxios.restore()
    store.dispatch(resetForm())
  })

  describe('Rendering', () => {
    it('should render all form fields with correct labels', () => {
      renderComponent()

      expect(screen.getByLabelText('Personnummer')).toBeInTheDocument()
      expect(screen.getByLabelText('Namn')).toBeInTheDocument()
      expect(screen.getByLabelText('Befattning')).toBeInTheDocument()
      expect(screen.getByLabelText('Namn på din verksamhet')).toBeInTheDocument()
      expect(screen.getByLabelText('Ägarform')).toBeInTheDocument()
      expect(screen.getByLabelText('Vårdform')).toBeInTheDocument()
      expect(screen.getByLabelText('Verksamhetstyp')).toBeInTheDocument()
      expect(screen.getByLabelText('Arbetsplatskod')).toBeInTheDocument()
    })

    it('should render required field indicators', () => {
      renderComponent()

      expect(screen.getByLabelText(/befattning/i)).toBeRequired()
      expect(screen.getByLabelText(/namn på din verksamhet/i)).toBeRequired()
      expect(screen.getByLabelText(/vårdform/i)).toBeRequired()
      expect(screen.getByLabelText(/verksamhetstyp/i)).toBeRequired()
    })

    it('should render dropdown options from API config', () => {
      renderComponent()

      const occupationDropdown = screen.getByLabelText(/befattning/i)
      fireEvent.click(occupationDropdown)

      expect(screen.getByText('Välj befattning')).toBeInTheDocument()
      expect(screen.getByText('Överläkare')).toBeInTheDocument()
      expect(screen.getByText('Distriktsläkare/Specialist allmänmedicin')).toBeInTheDocument()
      expect(screen.getByText('Skolläkare')).toBeInTheDocument()
    })

    it('should render disabled fields for personId and name', () => {
      renderComponent()

      expect(screen.getByRole('textbox', { name: 'Personnummer' })).toBeDisabled()
      expect(screen.getByRole('textbox', { name: 'Namn' })).toBeDisabled()
    })
  })

  describe('Form Interactions', () => {
    it('should dispatch updateField action when text inputs change', async () => {
      const user = userEvent.setup()
      renderComponent()

      const careUnitNameInput = screen.getByLabelText(/namn på din verksamhet/i)
      await user.type(careUnitNameInput, 'Test Clinic')

      await waitFor(() => {
        expect(store.getState().ui.pp.step01.data.careUnitName).toBe('Test Clinic')
      })
    })

    it('should dispatch updateField action when dropdowns change', async () => {
      const user = userEvent.setup()
      renderComponent()

      const occupationDropdown = screen.getByLabelText(/befattning/i)
      await user.selectOptions(occupationDropdown, 'overlakare')

      await waitFor(() => {
        expect(store.getState().ui.pp.step01.data.occupation).toBe('overlakare')
      })
    })

    it('should clear field errors when user types in a field that had errors', async () => {
      const user = userEvent.setup()

      store.dispatch(validateData())

      renderComponent()

      const careUnitNameInput = screen.getByLabelText(/namn på din verksamhet/i)
      await user.type(careUnitNameInput, 'New Clinic Name')

      await waitFor(() => {
        expect(store.getState().ui.pp.step01.errors?.careUnitName).toBeUndefined()
      })
    })
  })

  describe('Validation', () => {
    it('should display validation errors when present', () => {
      store.dispatch(validateData())

      renderComponent()

      expect(screen.getAllByText('Ange ett svar.')).toHaveLength(2)
      expect(screen.getAllByText('Välj ett alternativ.')).toHaveLength(3)
    })

    it('should validate form on submit and show errors', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByRole('button', { name: 'Fortsätt' }))

      expect(store.getState().ui.pp.step01.errors).toBeDefined()
    })
  })

  describe('Form Submission', () => {
    it('should navigate to next step when form is valid', async () => {
      store.dispatch(updateField({ field: 'personId', value: '19901010-1234' }))
      store.dispatch(updateField({ field: 'name', value: 'Test User' }))
      store.dispatch(updateField({ field: 'occupation', value: 'Överlakare' }))
      store.dispatch(updateField({ field: 'position', value: 'Specialist' }))
      store.dispatch(updateField({ field: 'careUnitName', value: 'Test Clinic' }))
      store.dispatch(updateField({ field: 'typeOfCare', value: 'Öppenvard' }))
      store.dispatch(updateField({ field: 'healthcareServiceType', value: 'Medicinsk Verksamhet' }))
      store.dispatch(updateField({ field: 'workplaceCode', value: '123456' }))

      renderComponent()

      await userEvent.click(screen.getByRole('button', { name: 'Fortsätt' }))

      await waitFor(() => {
        expect(screen.getByTestId('step-02')).toBeInTheDocument()
      })
    })

    it('should not navigate when form has validation errors', async () => {
      renderComponent()

      await userEvent.click(screen.getByRole('button', { name: 'Fortsätt' }))

      await waitFor(() => {
        expect(screen.queryByTestId('step-02')).not.toBeInTheDocument()
      })
      expect(screen.getByLabelText(/personnummer/i)).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show spinner when PP config is loading', async () => {
      store.dispatch(ppApi.util.resetApiState())
      fakeAxios.onGet('/api/private-practitioner/config').reply(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve([200, mockPPConfig]), 1000)
          })
      )

      renderComponent()

      expect(screen.getByTestId('spinner')).toBeInTheDocument()

      await waitFor(
        () => {
          expect(screen.getByLabelText(/personnummer/i)).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels and associations', () => {
      renderComponent()

      const inputs = screen.getAllByRole('textbox')
      const selects = screen.getAllByRole('combobox')

      const allFormElements = [...inputs, ...selects]
      allFormElements.forEach((element) => {
        expect(element).toHaveAccessibleName()
      })
    })

    it('should use proper ARIA attributes for error messages', () => {
      store.dispatch(validateData())

      renderComponent()

      const errorMessage = screen.getAllByText('Ange ett svar.')
      expect(errorMessage[0]).toHaveAttribute('role', 'alert')
    })
  })
})
