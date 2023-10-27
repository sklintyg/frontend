import { createCalendar } from '@internationalized/date'
import { useRef } from 'react'
import { AriaRangeCalendarProps, DateValue, useLocale, useRangeCalendar } from 'react-aria'
import { useRangeCalendarState } from 'react-stately'
import { CalendarGrid } from './CalendarGrid'
import { CalendarHeader } from './CalendarHeader'

export function RangeCalendar(props: AriaRangeCalendarProps<DateValue>) {
  const { locale } = useLocale()
  const state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar,
  })

  const ref = useRef(null)
  const { calendarProps, prevButtonProps, nextButtonProps, title } = useRangeCalendar(props, state, ref)

  return (
    <div {...calendarProps} ref={ref}>
      <CalendarHeader prevButtonProps={prevButtonProps} nextButtonProps={nextButtonProps} title={title} />
      <CalendarGrid state={state} />
    </div>
  )
}
