import { GregorianCalendar } from '@internationalized/date'
import type { AriaCalendarProps, DateValue} from 'react-aria';
import { useCalendar, useLocale } from 'react-aria'
import { useCalendarState } from 'react-stately'
import { CalendarGrid } from './CalendarGrid'
import { CalendarHeader } from './CalendarHeader'

function createCalendar(identifier: string) {
  switch (identifier) {
    case 'gregory':
      return new GregorianCalendar()
    default:
      throw new Error(`Unsupported calendar ${identifier}`)
  }
}

export function Calendar(props: AriaCalendarProps<DateValue>) {
  const { locale } = useLocale()
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  })

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(props, state)

  return (
    <div {...calendarProps}>
      <CalendarHeader prevButtonProps={prevButtonProps} nextButtonProps={nextButtonProps} title={title} />
      <CalendarGrid state={state} />
    </div>
  )
}
