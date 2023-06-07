import { render, screen } from '@testing-library/react'
import { I18nProvider } from 'react-aria'
import { DateRangePicker } from './DateRangePicker'

it('should render without errors', () => {
  expect(() => render(<DateRangePicker label="datumfält" />)).not.toThrow()
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
