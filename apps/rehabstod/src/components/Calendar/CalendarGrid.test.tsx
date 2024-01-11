import { GregorianCalendar, parseDate } from '@internationalized/date'
import { render, screen } from '@testing-library/react'
import { useCalendar } from 'react-aria'
import { useCalendarState } from 'react-stately'
import { expect, it } from 'vitest'
import { CalendarGrid } from './CalendarGrid'

function CalendarGridWrapper() {
  const state = useCalendarState({
    locale: 'sv-SE',
    value: parseDate('2020-02-03'),
    createCalendar() {
      return new GregorianCalendar()
    },
  })
  useCalendar({ value: parseDate('2020-02-03') }, state)

  return <CalendarGrid state={state} />
}

it('Should render without crashing', () => {
  expect(() => render(<CalendarGridWrapper />)).not.toThrow()
})

it.each(['må', 'ti', 'on', 'to', 'fr', 'lö', 'sö'])('Should display weekday %s', (weekDay) => {
  render(<CalendarGridWrapper />)
  expect(screen.getByText(weekDay)).toBeInTheDocument()
})

it('Should have the correct month', () => {
  render(<CalendarGridWrapper />)
  expect(screen.getByLabelText('February 2020')).toBeInTheDocument()
})
