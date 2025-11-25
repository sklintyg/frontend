import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { resetForm, validateData } from '../../store/pp/ppStep02ReducerSlice'
import store from '../../store/store'
import { PPRegistrationStep02 } from './PPRegistrationStep02'

let fakeAxios: MockAdapter

const renderComponent = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/register/steg-2']}>
        <Routes>
          <Route path="/register/steg-2" element={<PPRegistrationStep02 />} />
          <Route path="/register/steg-3" element={<div data-testid="step-03">Step 3</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

describe('PPRegistrationStep02', () => {
  beforeEach(async () => {
    fakeAxios = new MockAdapter(axios)
    fakeAxios.onGet('/api/config/area/73450').reply(200, [
      {
        zipCode: '73450',
        city: 'KOLBÄCK',
        municipality: 'HALLSTAHAMMAR',
        county: 'VÄSTMANLAND',
      },
    ])
  })

  afterEach(() => {
    fakeAxios.restore()
    store.dispatch(resetForm())
  })

  describe('Rendering', () => {
    it('should render all form fields with correct labels', () => {
      renderComponent()

      expect(screen.getByLabelText('Telefonnummer')).toBeInTheDocument()
      expect(screen.getByLabelText('E-postadress')).toBeInTheDocument()
      expect(screen.getByLabelText('Upprepa e-postadress')).toBeInTheDocument()
      expect(screen.getByLabelText('Postadress')).toBeInTheDocument()
      expect(screen.getByLabelText('Postnummer')).toBeInTheDocument()
      expect(screen.getByLabelText('Postort')).toBeInTheDocument()
      expect(screen.getByLabelText('Kommun')).toBeInTheDocument()
      expect(screen.getByLabelText('Län')).toBeInTheDocument()
    })

    it('should render required field indicators', () => {
      renderComponent()

      expect(screen.getByLabelText('Telefonnummer')).toBeRequired()
      expect(screen.getByLabelText('E-postadress')).toBeRequired()
      expect(screen.getByLabelText('Upprepa e-postadress')).toBeRequired()
      expect(screen.getByLabelText('Postadress')).toBeRequired()
      expect(screen.getByLabelText('Postnummer')).toBeRequired()
    })

    it('should render disabled fields', () => {
      renderComponent()

      expect(screen.getByLabelText('Postort')).toBeDisabled()
      expect(screen.getByLabelText('Kommun')).toBeDisabled()
      expect(screen.getByLabelText('Län')).toBeDisabled()
    })
  })

  describe('Form Interactions', () => {
    it('Should prevent user from pasting in repeat email field', async () => {
      const user = userEvent.setup()

      renderComponent()

      await user.click(screen.getByLabelText('Upprepa e-postadress'))
      await user.paste('foo')

      expect(screen.getByText('Ange e-postadressen genom att skriva in den.')).toBeInTheDocument()

      await user.type(screen.getByLabelText('Upprepa e-postadress'), 'email@test.se')

      expect(screen.queryByText('Ange e-postadressen genom att skriva in den.')).not.toBeInTheDocument()
    })

    it('Should fetch zipcode information and populate fields', async () => {
      const user = userEvent.setup()

      renderComponent()

      await user.type(screen.getByLabelText('Postnummer'), '73450')

      await waitFor(() => expect(screen.getByLabelText('Kommun')).toHaveValue('HALLSTAHAMMAR'))

      expect(screen.getByLabelText('Postort')).toHaveValue('KOLBÄCK')
      expect(screen.getByLabelText('Län')).toHaveValue('VÄSTMANLAND')
    })
  })

  describe('Validation', () => {
    it('should display validation errors when present', () => {
      store.dispatch(validateData())

      renderComponent()

      expect(screen.getAllByText('Ange ett svar.')).toHaveLength(3)
      expect(screen.getByText('Ange en giltig e-postadress.')).toBeInTheDocument()
      expect(screen.getByText('Upprepa e-postadress')).toBeInTheDocument()
      expect(screen.getByText('Postnummer fylls i med fem siffror 0-9.')).toBeInTheDocument()
    })

    it('Should validate that emails are equal', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.type(screen.getByLabelText('E-postadress'), 'first@test.se')
      await user.type(screen.getByLabelText('Upprepa e-postadress'), 'second@test.se')

      await user.click(screen.getByRole('button', { name: 'Fortsätt' }))

      expect(screen.getAllByText('E-postadresserna stämmer inte överens med varandra.')).toHaveLength(2)
    })

    it('should validate form on submit and show errors', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByRole('button', { name: 'Fortsätt' }))

      expect(store.getState().ui.pp.step02.errors).toMatchObject({
        address: ['Ange ett svar.'],
        city: ['Ange ett svar.'],
        county: ['Ange ett svar.'],
        email: ['Ange en giltig e-postadress.'],
        emailRepeat: ['Ange ett svar.'],
        municipality: ['Välj ett alternativ.'],
        phoneNumber: ['Ange ett svar.'],
        zipCode: ['Postnummer fylls i med fem siffror 0-9.'],
      })
    })

    it('Should force user to choose municipality when there are alternatives', async () => {
      fakeAxios.onGet('/api/config/area/83152').reply(200, [
        {
          zipCode: '83152',
          city: 'ÖSTERSUND',
          municipality: 'KROKOM',
          county: 'JÄMTLAND',
        },
        {
          zipCode: '83152',
          city: 'ÖSTERSUND',
          municipality: 'ÖSTERSUND',
          county: 'JÄMTLAND',
        },
      ])
      const user = userEvent.setup()

      renderComponent()

      await user.type(screen.getByLabelText('Postnummer'), '83152')

      await user.click(screen.getByRole('button', { name: 'Fortsätt' }))

      expect(screen.getByText('Välj ett alternativ.')).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should navigate to next step when form is valid', async () => {
      const user = userEvent.setup()

      renderComponent()

      await user.type(screen.getByLabelText('Telefonnummer'), '123123123')
      await user.type(screen.getByLabelText('E-postadress'), 'email@test.se')
      await user.type(screen.getByLabelText('Upprepa e-postadress'), 'email@test.se')
      await user.type(screen.getByLabelText('Postadress'), 'Bästvägen 12')
      await user.type(screen.getByLabelText('Postnummer'), '73450')

      await user.click(screen.getByRole('button', { name: 'Fortsätt' }))

      await waitFor(() => {
        expect(screen.getByTestId('step-03')).toBeInTheDocument()
      })
    })

    it('should not navigate when form has validation errors', async () => {
      renderComponent()

      await userEvent.click(screen.getByRole('button', { name: 'Fortsätt' }))

      await waitFor(() => {
        expect(screen.queryByTestId('step-03')).not.toBeInTheDocument()
      })
      expect(screen.getByLabelText('Telefonnummer')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels and associations', () => {
      renderComponent()

      const inputs = screen.getAllByRole('textbox')

      inputs.forEach((element) => {
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
