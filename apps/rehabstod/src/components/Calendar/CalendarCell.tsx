import { CalendarDate } from '@internationalized/date'
import { useRef } from 'react'
import { mergeProps, useCalendarCell, useFocusRing } from 'react-aria'
import { CalendarState } from 'react-stately'
import { classNames } from '../../utils/classNames'

function getStyle(isSelected: boolean, isDisabled: boolean, isUnavailable: boolean): string | boolean {
  if (isSelected) {
    return 'bg-accent-40 hover:bg-accent-30 active:bg-accent-30 text-white'
  }
  if (isDisabled) {
    return 'bg-white hover:bg-white active:bg-white italic text-neutral-40'
  }

  if (isUnavailable) {
    return 'italic'
  }

  return false
}

export function CalendarCell({ state, date }: { state: CalendarState; date: CalendarDate }) {
  const ref = useRef(null)
  const { focusProps } = useFocusRing()
  const { cellProps, buttonProps, isSelected, isOutsideVisibleRange, isDisabled, isUnavailable, formattedDate } = useCalendarCell(
    { date },
    state,
    ref
  )
  return (
    <td {...cellProps} className="p-0.5">
      <button
        type="button"
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideVisibleRange}
        disabled={isDisabled}
        className={classNames(
          'text-sm w-8 h-8 rounded-full hover:bg-neutral-99 active:bg-neutral-99',
          getStyle(isSelected, isDisabled, isUnavailable)
        )}>
        {formattedDate}
      </button>
    </td>
  )
}
