/* eslint-disable react/no-array-index-key */
import { getWeeksInMonth } from '@internationalized/date'
import { useCalendarGrid, useLocale } from 'react-aria'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarCell } from './CalendarCell'

export function CalendarGrid({ state, ...props }: { state: CalendarState | RangeCalendarState }) {
  const { locale } = useLocale()
  const { gridProps, headerProps } = useCalendarGrid(props, state)

  const weekDays = ['må', 'ti', 'on', 'to', 'fr', 'lö', 'sö']

  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <table {...gridProps} cellPadding="0" className="w-full flex-1">
      <thead {...headerProps} className="text-xs uppercase text-neutral-40">
        <tr>
          {weekDays.map((day, index) => (
            <th key={index}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex).map((date, index) =>
              date ? (
                <CalendarCell key={index} state={state} date={date} />
              ) : (
                <td key={date}>
                  <span className="h-4" />{' '}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
