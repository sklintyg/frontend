import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider } from 'react-aria'
import { DateRangePicker } from './DateRangePicker'

it('should render without errors', () => {
  expect(() => render(<DateRangePicker label="datumfält" />)).not.toThrow()
})

it('should toggle open state when button is pressed', async () => {
  render(<DateRangePicker label="datumfält" />)
  await userEvent.click(screen.getByTestId('calendar-button'))
  expect(screen.getByTestId('calendar-button')).toHaveAttribute('data-state', 'open')
  await userEvent.click(screen.getByTestId('calendar-button'))
  expect(screen.getByTestId('calendar-button')).toHaveAttribute('data-state', 'closed')
})

describe('Segments', () => {
  it('should render date placeholders', () => {
    render(<DateRangePicker label="datumfält" />)
    expect(screen.getByLabelText('Start Date month')).toBeInTheDocument()
    expect(screen.getByLabelText('Start Date day')).toBeInTheDocument()
    expect(screen.getByLabelText('Start Date year')).toBeInTheDocument()
    expect(screen.getByLabelText('End Date month')).toBeInTheDocument()
    expect(screen.getByLabelText('End Date day')).toBeInTheDocument()
    expect(screen.getByLabelText('End Date year')).toBeInTheDocument()
  })

  it('should render date placeholders with swedish locales', () => {
    render(
      <I18nProvider locale="sv-SE">
        <DateRangePicker label="datumfält" />
      </I18nProvider>
    )
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
    render(
      <I18nProvider locale="sv-SE">
        <DateRangePicker label="datumfält" />
      </I18nProvider>
    )

    await userEvent.type(screen.getByLabelText('Slutdatum dag'), '03')

    expect(document.activeElement).toBe(screen.getByLabelText('Slutdatum dag'))

    await userEvent.keyboard('[Backspace][Backspace]')

    expect(document.activeElement).toBe(screen.getByLabelText('Slutdatum månad'))
  })

  it('Should focus previous field when pressing backspace on empty segment', async () => {
    render(
      <I18nProvider locale="sv-SE">
        <DateRangePicker label="datumfält" />
      </I18nProvider>
    )

    await userEvent.type(screen.getByLabelText('Slutdatum år'), '2')

    expect(document.activeElement).toBe(screen.getByLabelText('Slutdatum år'))

    await userEvent.keyboard('[Backspace][Backspace]')

    expect(document.activeElement).toBe(screen.getByLabelText('Startdatum dag'))
  })
})
