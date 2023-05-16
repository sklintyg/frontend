import { CalendarDate } from '@internationalized/date'
import { useRef } from 'react'
import { mergeProps, useCalendarCell, useFocusRing } from 'react-aria'
import { CalendarState } from 'react-stately'
import { classNames } from '../../utils/classNames'

export function CalendarCell({ state, date }: { state: CalendarState; date: CalendarDate }) {
  const ref = useRef(null)
  const { focusProps, isFocusVisible } = useFocusRing()
  const { cellProps, buttonProps, isSelected, isOutsideVisibleRange, isDisabled, isUnavailable, formattedDate } = useCalendarCell(
    { date },
    state,
    ref
  )

  return (
    <td {...cellProps} className={classNames('py-0.5 relative', isFocusVisible ? 'z-10' : 'z-0')}>
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={classNames('cell', isSelected && 'selected', isDisabled && 'text-gray-400', isUnavailable && 'unavailable')}>
        {formattedDate}
      </div>
    </td>
  )
}
