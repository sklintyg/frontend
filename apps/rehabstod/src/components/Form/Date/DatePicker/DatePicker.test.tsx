import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider } from 'react-aria'
import { DatePicker } from './DatePicker'

it('should render without errors', () => {
  expect(() => render(<DatePicker label="datumfält" />)).not.toThrow()
})

it('should render placeholders', () => {
  render(<DatePicker label="datumfält" />)
  expect(screen.getByLabelText('month')).toBeInTheDocument()
  expect(screen.getByLabelText('day')).toBeInTheDocument()
  expect(screen.getByLabelText('year')).toBeInTheDocument()
})

it('should toggle open state when button is pressed', async () => {
  render(<DatePicker label="datumfält" />)
  await userEvent.click(screen.getByTestId('calendar-button'))
  expect(screen.getByTestId('calendar-button')).toHaveAttribute('data-state', 'open')
  await userEvent.click(screen.getByTestId('calendar-button'))
  expect(screen.getByTestId('calendar-button')).toHaveAttribute('data-state', 'closed')
})

it('should render placeholders with swedish locale', () => {
  render(
    <I18nProvider locale="sv-SE">
      <DatePicker label="datumfält" />
    </I18nProvider>
  )
  expect(screen.getByLabelText('dag')).toBeInTheDocument()
  expect(screen.getByLabelText('månad')).toBeInTheDocument()
  expect(screen.getByLabelText('år')).toBeInTheDocument()
})
