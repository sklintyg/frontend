import { createCalendar } from '@internationalized/date'
import { AriaCalendarProps, DateValue, useCalendar, useLocale } from 'react-aria'
import { useCalendarState } from 'react-stately'
import { CalendarGrid } from './CalendarGrid'
import { CalendarHeader } from './CalendarHeader'

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
