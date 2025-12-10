import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { expect } from 'vitest'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { api } from '../../store/api'
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
    store.dispatch(api.util.resetApiState())
  })

  describe('Rendering', () => {
    it('should render heading and informational text', () => {
      renderComponent()

      expect(screen.getByRole('heading', { name: 'Kontaktuppgifter till verksamheten', level: 3 })).toBeInTheDocument()
      expect(
        screen.getByText(/Ange de kontaktuppgifter du vill ska användas när Inera eller intygsmottagare behöver kontakta dig/)
      ).toBeInTheDocument()
      expect(screen.getByText('Fält markerade med asterisk (*) är obligatoriska.')).toBeInTheDocument()
    })

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
    it('should sanitize phone number input to only allow numeric characters', async () => {
      const user = userEvent.setup()

      renderComponent()

      const phoneInput = screen.getByLabelText('Telefonnummer') as HTMLInputElement

      await user.type(phoneInput, '123abc456')

      expect(phoneInput).toHaveAttribute('type', 'number')
      expect(phoneInput).toHaveAttribute('inputMode', 'numeric')
    })

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

    it('Should clear city, municipality, and county when zip code is cleared', async () => {
      const user = userEvent.setup()

      renderComponent()

      await user.type(screen.getByLabelText('Postnummer'), '73450')

      await waitFor(() => expect(screen.getByLabelText('Kommun')).toHaveValue('HALLSTAHAMMAR'))

      expect(screen.getByLabelText('Postort')).toHaveValue('KOLBÄCK')
      expect(screen.getByLabelText('Län')).toHaveValue('VÄSTMANLAND')

      await user.clear(screen.getByLabelText('Postnummer'))

      await waitFor(() => {
        expect(screen.getByLabelText('Postort')).toHaveValue('')
      })

      expect(screen.getByLabelText('Kommun')).toHaveValue('')
      expect(screen.getByLabelText('Län')).toHaveValue('')
    })

    it('Should clear old data when zip code changes to a new value', async () => {
      fakeAxios.onGet('/api/config/area/22222').reply(200, [
        {
          zipCode: '22222',
          city: 'LUND',
          municipality: 'LUND',
          county: 'SKÅNE',
        },
      ])

      const user = userEvent.setup()

      renderComponent()

      await user.type(screen.getByLabelText('Postnummer'), '73450')

      await waitFor(() => expect(screen.getByLabelText('Kommun')).toHaveValue('HALLSTAHAMMAR'))

      await user.clear(screen.getByLabelText('Postnummer'))
      await user.type(screen.getByLabelText('Postnummer'), '22222')

      await waitFor(() => {
        expect(screen.getByLabelText('Kommun')).toHaveValue('LUND')
      })

      expect(screen.getByLabelText('Postort')).toHaveValue('LUND')
      expect(screen.getByLabelText('Län')).toHaveValue('SKÅNE')
    })

    it('Should show disabled TextInput for municipality when there is only one option', async () => {
      const user = userEvent.setup()

      renderComponent()

      expect(screen.getByLabelText('Kommun')).toBeDisabled()
      expect(screen.getByLabelText('Kommun')).toHaveValue('')

      await user.type(screen.getByLabelText('Postnummer'), '73450')

      await waitFor(() => {
        const kommunInput = screen.getByLabelText('Kommun')
        expect(kommunInput).toBeDisabled()
      })

      expect(screen.getByLabelText('Kommun')).toHaveValue('HALLSTAHAMMAR')

      expect(screen.queryByRole('combobox', { name: 'Kommun' })).not.toBeInTheDocument()
    })

    it('Should show dropdown for municipality when there are multiple options', async () => {
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

      await waitFor(() => {
        expect(screen.getByRole('combobox', { name: 'Kommun' })).toBeInTheDocument()
      })

      expect(screen.getByRole('option', { name: 'KROKOM' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'ÖSTERSUND' })).toBeInTheDocument()
    })

    it('Should preserve municipality selection in state after selecting from dropdown', async () => {
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

      await waitFor(() => {
        expect(screen.getByRole('combobox', { name: 'Kommun' })).toBeInTheDocument()
      })

      await user.selectOptions(screen.getByRole('combobox', { name: 'Kommun' }), 'ÖSTERSUND')

      await waitFor(() => {
        expect(screen.getByLabelText('Kommun')).toHaveValue('ÖSTERSUND')
      })

      expect(screen.getByLabelText('Postort')).toHaveValue('ÖSTERSUND')
      expect(screen.getByLabelText('Län')).toHaveValue('JÄMTLAND')

      const state = store.getState().ui.pp.step02.data
      expect(state.zipCode).toBe('83152')
      expect(state.municipality).toBe('ÖSTERSUND')
      expect(state.city).toBe('ÖSTERSUND')
      expect(state.county).toBe('JÄMTLAND')
    })
  })

  describe('Validation', () => {
    it('should apply error styling to email fields when emails do not match', async () => {
      const user = userEvent.setup()
      renderComponent()

      const emailInput = screen.getByLabelText('E-postadress')
      const emailRepeatInput = screen.getByLabelText('Upprepa e-postadress')

      await user.type(emailInput, 'first@test.se')
      await user.type(emailRepeatInput, 'second@test.se')
      await user.click(screen.getByRole('button', { name: 'Fortsätt' }))

      await waitFor(() => {
        expect(emailInput).toHaveClass('ic-textfield--error')
      })

      await waitFor(() =>{
        expect(emailRepeatInput).toHaveClass('ic-textfield--error')
      })
    })

    it('should remove error styling from email fields when emails match', async () => {
      const user = userEvent.setup()
      renderComponent()

      const emailInput = screen.getByLabelText('E-postadress')
      const emailRepeatInput = screen.getByLabelText('Upprepa e-postadress')

      await user.type(emailInput, 'same@test.se')
      await user.type(emailRepeatInput, 'same@test.se')

      expect(emailInput).not.toHaveClass('ic-textfield--error')
    })

    it('should display validation errors when present', () => {
      store.dispatch(validateData())

      renderComponent()

      expect(screen.getAllByText('Ange ett svar.')).toHaveLength(2)
      expect(screen.getByText('Ange en giltig e-postadress.')).toBeInTheDocument()
      expect(screen.getByText('Ange telefonnummer.')).toBeInTheDocument()
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
        municipality: ['Uppgift om kommun har två eller fler träffar. Ange den kommun som är rätt.'],
        phoneNumber: ['Ange telefonnummer.'],
        zipCode: ['Postnummer fylls i med fem siffror 0-9.', 'Ange ett giltigt postnummer.'],
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

      await waitFor(() => {
        expect(screen.getByRole('combobox', { name: 'Kommun' })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: 'Fortsätt' }))

      await waitFor(() => {
        expect(screen.getByText('Uppgift om kommun har två eller fler träffar. Ange den kommun som är rätt.')).toBeInTheDocument()
      })
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
