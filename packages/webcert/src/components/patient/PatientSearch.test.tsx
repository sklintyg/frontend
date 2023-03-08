import { fakePatient } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { vi } from 'vitest'
import { setPatient } from '../../store/patient/patientActions'
import store from '../../store/store'
import PatientSearch from './PatientSearch'

const EXPECTED_VALIDATION_TEXT = 'Ange ett giltigt person- eller samordningsnummer.'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <Router history={history}>
        <PatientSearch />
      </Router>
    </Provider>
  )
}

const history = createBrowserHistory()
history.push = vi.fn()

describe('PatientSearch', () => {
  it('should render component', () => {
    renderComponent()
  })

  it('should not route if patient is not set', () => {
    renderComponent()
    userEvent.type(screen.getByRole('textbox'), '191212121212')
    userEvent.click(screen.getByText('Fortsätt'))
    store.dispatch(setPatient(undefined))

    expect(history.push).not.toHaveBeenCalled()
  })

  it('should route if patient is set', () => {
    renderComponent()
    userEvent.type(screen.getByRole('textbox'), '191212121212')
    store.dispatch(setPatient(fakePatient()))
    userEvent.click(screen.getByText('Fortsätt'))

    expect(history.push).toHaveBeenCalled()
  })

  describe('Input', () => {
    it('should allow user to type patient id', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      userEvent.type(input, '191212')
      expect(input).toHaveValue('191212')
    })

    it('should add dash when user types patient id', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      userEvent.type(input, '191212121212')
      expect(input).toHaveValue('19121212-1212')
    })
  })

  describe('Submit', () => {
    it('should have submit disabled if no input', () => {
      renderComponent()
      expect(screen.getByText('Fortsätt')).toBeDisabled()
    })

    it('should have submit disabled if input is not correct patient id', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      userEvent.type(input, '191212')
      expect(screen.getByText('Fortsätt')).toBeDisabled()
    })

    it('should have submit enabled if input is correct patient id', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      userEvent.type(input, '191212121212')
      expect(screen.getByText('Fortsätt')).toBeEnabled()
    })
  })

  describe('Validation', () => {
    it('should not validate patient id if focus is on the input', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      userEvent.type(input, '19121')
      expect(screen.queryByText(EXPECTED_VALIDATION_TEXT)).not.toBeInTheDocument()
    })

    it('should validate patient id if focus is not on the input', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      userEvent.type(input, '19121')
      userEvent.click(screen.getByRole('heading'))
      expect(screen.getByText(EXPECTED_VALIDATION_TEXT)).toBeInTheDocument()
    })

    it('should remove validation error when input gets focus', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      userEvent.type(input, '19121')
      userEvent.click(screen.getByRole('heading'))
      userEvent.type(input, '12')
      expect(screen.queryByText(EXPECTED_VALIDATION_TEXT)).not.toBeInTheDocument()
    })

    it('should not show validation error if patient id is correct', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      userEvent.type(input, '191212121212')
      userEvent.click(screen.getByRole('heading'))
      expect(screen.queryByText(EXPECTED_VALIDATION_TEXT)).not.toBeInTheDocument()
    })

    it('should show validation error without blur if wrong id with 12 numbers', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      userEvent.type(input, '191212121213')
      expect(screen.queryByText(EXPECTED_VALIDATION_TEXT)).toBeInTheDocument()
    })
  })
})
