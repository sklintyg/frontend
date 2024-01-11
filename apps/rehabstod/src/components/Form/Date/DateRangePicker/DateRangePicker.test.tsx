import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { I18nProvider } from 'react-aria'
import { expect, it, describe } from 'vitest'
import { DateRangePicker } from './DateRangePicker'

function WrapperComponent() {
  const [value, updateValue] = useState<{ start?: string | null; end?: string | null }>({ start: null, end: null })
  return (
    <I18nProvider locale="sv-SE">
      <DateRangePicker label="Datumfält" startDate={value.start} endDate={value.end} onDataChanged={updateValue} />
    </I18nProvider>
  )
}

it('should render without errors', () => {
  expect(() => render(<DateRangePicker label="Datumfält" />)).not.toThrow()
})

it('should toggle open state when button is pressed', async () => {
  render(<DateRangePicker label="Datumfält" />)
  await userEvent.click(screen.getByRole('button', { name: 'Datumfält Calendar' }))
  expect(screen.getByRole('button', { name: 'Datumfält Calendar' })).toHaveAttribute('data-state', 'open')
  await userEvent.click(screen.getByRole('button', { name: 'Datumfält Calendar' }))
  expect(screen.getByRole('button', { name: 'Datumfält Calendar' })).toHaveAttribute('data-state', 'closed')
})

describe('Segments', () => {
  it('should render date placeholders', () => {
    render(<DateRangePicker label="Datumfält" />)
    expect(screen.getByLabelText('Start Date month')).toBeInTheDocument()
    expect(screen.getByLabelText('Start Date day')).toBeInTheDocument()
    expect(screen.getByLabelText('Start Date year')).toBeInTheDocument()
    expect(screen.getByLabelText('End Date month')).toBeInTheDocument()
    expect(screen.getByLabelText('End Date day')).toBeInTheDocument()
    expect(screen.getByLabelText('End Date year')).toBeInTheDocument()
  })

  it('should render date placeholders with swedish locales', () => {
    render(<WrapperComponent />)
    expect(screen.getByLabelText('Startdatum dag')).toBeInTheDocument()
    expect(screen.getByLabelText('Startdatum månad')).toBeInTheDocument()
    expect(screen.getByLabelText('Startdatum år')).toBeInTheDocument()
    expect(screen.getByLabelText('Slutdatum dag')).toBeInTheDocument()
    expect(screen.getByLabelText('Slutdatum månad')).toBeInTheDocument()
    expect(screen.getByLabelText('Slutdatum år')).toBeInTheDocument()
  })
})

describe('Focus', () => {
  it('Should focus previous segment when pressing backspace on empty segment', async () => {
    render(<WrapperComponent />)

    await userEvent.type(screen.getByLabelText('Slutdatum dag'), '03')

    expect(screen.getByLabelText('Slutdatum dag')).toHaveFocus()

    await userEvent.keyboard('[Backspace][Backspace]')

    expect(screen.getByLabelText('Slutdatum månad')).toHaveFocus()
  })

  it('Should focus previous field when pressing backspace on empty segment', async () => {
    render(<WrapperComponent />)

    await userEvent.type(screen.getByLabelText('Slutdatum år'), '2')

    expect(screen.getByLabelText('Slutdatum år')).toHaveFocus()

    await userEvent.keyboard('[Backspace][Backspace]')

    expect(screen.getByLabelText('Startdatum dag')).toHaveFocus()
  })
})

it('Should be possible to reset partial date', async () => {
  render(<WrapperComponent />)
  await userEvent.type(screen.getByLabelText('Startdatum år'), '2023')
  await userEvent.type(screen.getByLabelText('Startdatum månad'), '12')

  expect(screen.getByLabelText('Startdatum år')).toHaveAttribute('aria-valuetext', '2023')
  expect(screen.getByLabelText('Startdatum månad')).toHaveAttribute('aria-valuetext', '12 – december')

  await userEvent.click(screen.getByRole('button', { name: 'Datumfält Kalender' }))
  await userEvent.click(screen.getByText('Återställ'))

  expect(screen.getByLabelText('Startdatum år')).toHaveAttribute('aria-valuetext', 'Tomt')
  expect(screen.getByLabelText('Startdatum månad')).toHaveAttribute('aria-valuetext', 'Tomt')
})
