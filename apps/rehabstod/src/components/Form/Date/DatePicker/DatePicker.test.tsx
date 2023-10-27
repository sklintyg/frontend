import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { I18nProvider } from 'react-aria'
import { DatePicker } from './DatePicker'

function WrapperComponent() {
  const [value, updateValue] = useState<string | null | undefined>(null)
  return (
    <I18nProvider locale="sv-SE">
      <DatePicker label="Datumfält" date={value} onDataChanged={updateValue} />
    </I18nProvider>
  )
}

it('should render without errors', () => {
  expect(() => render(<DatePicker label="Datumfält" />)).not.toThrow()
})

it('should render placeholders', () => {
  render(<DatePicker label="Datumfält" />)
  expect(screen.getByLabelText('month')).toBeInTheDocument()
  expect(screen.getByLabelText('day')).toBeInTheDocument()
  expect(screen.getByLabelText('year')).toBeInTheDocument()
})

it('should toggle open state when button is pressed', async () => {
  render(<DatePicker label="Datumfält" />)
  await userEvent.click(screen.getByRole('button', { name: 'Datumfält Calendar' }))
  expect(screen.getByRole('button', { name: 'Datumfält Calendar' })).toHaveAttribute('data-state', 'open')
  await userEvent.click(screen.getByRole('button', { name: 'Datumfält Calendar' }))
  expect(screen.getByRole('button', { name: 'Datumfält Calendar' })).toHaveAttribute('data-state', 'closed')
})

it('should render placeholders with swedish locale', () => {
  render(<WrapperComponent />)
  expect(screen.getByLabelText('dag')).toBeInTheDocument()
  expect(screen.getByLabelText('månad')).toBeInTheDocument()
  expect(screen.getByLabelText('år')).toBeInTheDocument()
})

it('Should focus previous segment when pressing backspace on empty segment', async () => {
  render(<WrapperComponent />)

  await userEvent.type(screen.getByLabelText('dag'), '03')

  expect(screen.getByLabelText('dag')).toHaveFocus()

  await userEvent.keyboard('[Backspace][Backspace]')

  expect(screen.getByLabelText('månad')).toHaveFocus()
})

it('Should be possible to reset partial date', async () => {
  render(<WrapperComponent />)
  await userEvent.type(screen.getByLabelText('år'), '2023')
  await userEvent.type(screen.getByLabelText('månad'), '12')

  expect(screen.getByLabelText('år')).toHaveAttribute('aria-valuetext', '2023')
  expect(screen.getByLabelText('månad')).toHaveAttribute('aria-valuetext', '12 – december')

  await userEvent.click(screen.getByRole('button', { name: 'Datumfält Kalender' }))
  await userEvent.click(screen.getByText('Återställ'))

  expect(screen.getByLabelText('år')).toHaveAttribute('aria-valuetext', 'Tomt')
  expect(screen.getByLabelText('månad')).toHaveAttribute('aria-valuetext', 'Tomt')
})
