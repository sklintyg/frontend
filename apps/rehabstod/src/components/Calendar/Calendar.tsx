import { createCalendar } from '@internationalized/date'
import { useRef } from 'react'
import { AriaButtonProps, AriaCalendarProps, DateValue, useButton, useCalendar, useLocale } from 'react-aria'
import { useCalendarState } from 'react-stately'
import { classNames } from '../../utils/classNames'
import { CalendarGrid } from './CalendarGrid'

function CalendarButton(props: AriaButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)
  const { children } = props

  return (
    <button type="button" {...buttonProps} ref={ref} className="px-3">
      {children}
    </button>
  )
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
    <div {...calendarProps} className={classNames('calendar')}>
      <div className="mb-2 flex w-full">
        <CalendarButton {...prevButtonProps}>&lt;</CalendarButton>
        <span className="grow whitespace-nowrap text-center">{title}</span>
        <CalendarButton {...nextButtonProps}>&gt;</CalendarButton>
      </div>
      <CalendarGrid state={state} />
    </div>
  )
}
