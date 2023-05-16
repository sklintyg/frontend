import { IDSButton } from '@frontend/ids-react-ts'
import { createCalendar } from '@internationalized/date'
import { AriaCalendarProps, DateValue, useCalendar, useLocale } from 'react-aria'
import { useCalendarState } from 'react-stately'
import { classNames } from '../../utils/classNames'
import { CalendarGrid } from './CalendarGrid'

export function Calendar(props: AriaCalendarProps<DateValue>) {
  const { locale } = useLocale()
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  })

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(props, state)

  return (
    <div {...calendarProps} className={classNames('calendar')}>
      <div className={classNames('header')}>
        <h2>{title}</h2>
        <IDSButton {...prevButtonProps}>&lt;</IDSButton>
        <IDSButton {...nextButtonProps}>&gt;</IDSButton>
      </div>
      <CalendarGrid state={state} />
    </div>
  )
}
