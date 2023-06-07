import { render, screen } from '@testing-library/react'
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
