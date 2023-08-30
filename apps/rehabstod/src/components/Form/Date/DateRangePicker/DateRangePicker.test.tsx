import { render, screen } from '@testing-library/react'
import { I18nProvider } from 'react-aria'
import { DateRangePicker } from './DateRangePicker'

it('should render without errors', () => {
  expect(() => render(<DateRangePicker label="datumfält" />)).not.toThrow()
})

describe('Segments', () => {
  it('should render date placeholders', () => {
    render(<DateRangePicker label="datumfält" />)
    expect(screen.getByLabelText('month, Start Date,')).toBeInTheDocument()
    expect(screen.getByLabelText('day, Start Date,')).toBeInTheDocument()
    expect(screen.getByLabelText('year, Start Date,')).toBeInTheDocument()
    expect(screen.getByLabelText('month, End Date,')).toBeInTheDocument()
    expect(screen.getByLabelText('day, End Date,')).toBeInTheDocument()
    expect(screen.getByLabelText('year, End Date,')).toBeInTheDocument()
  })

  it('should render date placeholders with swedish locales', () => {
    render(
      <I18nProvider locale="sv-SE">
        <DateRangePicker label="datumfält" />
      </I18nProvider>
    )
    expect(screen.getByLabelText('dag, Startdatum,')).toBeInTheDocument()
    expect(screen.getByLabelText('månad, Startdatum,')).toBeInTheDocument()
    expect(screen.getByLabelText('år, Startdatum,')).toBeInTheDocument()
    expect(screen.getByLabelText('dag, Slutdatum,')).toBeInTheDocument()
    expect(screen.getByLabelText('månad, Slutdatum,')).toBeInTheDocument()
    expect(screen.getByLabelText('år, Slutdatum,')).toBeInTheDocument()
  })
})
