import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fakePatient } from '../../faker'
import { setPatient } from '../../store/patient/patientActions'
import store from '../../store/store'
import PatientSearch from './PatientSearch'

const EXPECTED_VALIDATION_TEXT = 'Ange ett giltigt person- eller samordningsnummer.'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route path="/search" element={<PatientSearch />} />
          <Route path="/create/:id" element="you are on the patient page" />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('PatientSearch', () => {
  beforeEach(() => {
    store.dispatch(setPatient(undefined))
  })

  it('should render component', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should not route if patient is not set', async () => {
    renderComponent()
    await userEvent.type(screen.getByRole('textbox'), '191212121212')
    await userEvent.click(screen.getByText('Fortsätt'))

    expect(screen.queryByText(/you are on the patient page/i)).not.toBeInTheDocument()
  })

  it('should route if patient is set', async () => {
    renderComponent()
    await userEvent.type(screen.getByRole('textbox'), '191212121212')
    store.dispatch(setPatient(fakePatient()))
    await userEvent.click(screen.getByText('Fortsätt'))

    expect(await screen.findByText(/you are on the patient page/i)).toBeInTheDocument()
  })

  describe('Input', () => {
    it('should allow user to type patient id', async () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '191212')
      await expect(input).toHaveValue('191212')
    })

    it('should add dash when user types patient id', async () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '191212121212')
      await expect(input).toHaveValue('19121212-1212')
    })
  })

  describe('Submit', () => {
    it('should have submit disabled if no input', async () => {
      renderComponent()
      await expect(screen.getByText('Fortsätt')).toBeDisabled()
    })

    it('should have submit disabled if input is not correct patient id', async () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '191212')
      await expect(screen.getByText('Fortsätt')).toBeDisabled()
    })

    it('should have submit enabled if input is correct patient id', async () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '191212121212')
      await expect(screen.getByText('Fortsätt')).toBeEnabled()
    })
  })

  describe('Validation', () => {
    it('should not validate patient id if focus is on the input', async () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '19121')
      expect(screen.queryByText(EXPECTED_VALIDATION_TEXT)).not.toBeInTheDocument()
    })

    it('should validate patient id if focus is not on the input', async () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '19121')
      await userEvent.click(screen.getByRole('heading'))
      expect(screen.getByText(EXPECTED_VALIDATION_TEXT)).toBeInTheDocument()
    })

    it('should remove validation error when input gets focus', async () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '19121')
      await userEvent.click(screen.getByRole('heading'))
      await userEvent.type(input, '12')
      expect(screen.queryByText(EXPECTED_VALIDATION_TEXT)).not.toBeInTheDocument()
    })

    it('should not show validation error if patient id is correct', async () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '191212121212')
      await userEvent.click(screen.getByRole('heading'))
      expect(screen.queryByText(EXPECTED_VALIDATION_TEXT)).not.toBeInTheDocument()
    })

    it('should show validation error without blur if wrong id with 12 numbers', async () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '191212121213')
      expect(await screen.findByText(EXPECTED_VALIDATION_TEXT)).toBeInTheDocument()
    })
  })
})
