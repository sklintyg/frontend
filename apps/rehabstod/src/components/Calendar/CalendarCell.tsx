import type { CalendarDate } from '@internationalized/date'
import { getDayOfWeek, isSameDay } from '@internationalized/date'
import { useRef } from 'react'
import { mergeProps, useCalendarCell, useFocusRing, useLocale } from 'react-aria'
import type { CalendarState, RangeCalendarState } from 'react-stately'
import { classNames } from '../../utils/classNames'

export function CalendarCell({ state, date }: { state: CalendarState | RangeCalendarState; date: CalendarDate }) {
  const ref = useRef(null)
  const { cellProps, buttonProps, isSelected, isOutsideVisibleRange, isDisabled, formattedDate } = useCalendarCell({ date }, state, ref)

  // The start and end date of the selected range will have
  // an emphasized appearance.
  const isSelectionStart =
    'highlightedRange' in state && state.highlightedRange ? isSameDay(date, state.highlightedRange.start) : isSelected
  const isSelectionEnd = 'highlightedRange' in state && state.highlightedRange ? isSameDay(date, state.highlightedRange.end) : isSelected

  // We add rounded corners on the left for the first day of the month,
  // the first day of each week, and the start date of the selection.
  // We add rounded corners on the right for the last day of the month,
  // the last day of each week, and the end date of the selection.
  const { locale } = useLocale()
  const dayOfWeek = getDayOfWeek(date, locale)
  const isRoundedLeft = isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1)
  const isRoundedRight = isSelected && (isSelectionEnd || dayOfWeek === 6 || date.day === date.calendar.getDaysInMonth(date))

  const { focusProps, isFocusVisible } = useFocusRing()

  return (
    <td {...cellProps} className={`relative py-0.5 ${isFocusVisible ? 'z-10' : 'z-0'}`}>
      <button
        type="button"
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={classNames(
          'w-10 h-10 group outline-none',
          isRoundedLeft && 'rounded-l-full',
          isRoundedRight && 'rounded-r-full',
          isSelected && 'bg-accent-40 text-white',
          isDisabled && 'disabled'
        )}
      >
        <div
          className={classNames(
            'w-full h-full rounded-full flex items-center justify-center',
            isDisabled && 'italic text-neutral-40',
            isFocusVisible && 'ring-2 group-focus:z-2 ring-neutral-20 ring-offset-2',
            // Darker selection background for the start and end.
            Boolean(isSelectionStart || isSelectionEnd) && 'bg-accent-30 border-2 border-white',
            // Hover state for cells in the middle of the range.
            Boolean(isSelected && !isDisabled && !(isSelectionStart || isSelectionEnd)) && 'hover:bg-accent-30',
            // Hover state for non-selected cells.
            Boolean(!isSelected && !isDisabled) && 'hover:bg-accent-30 hover:text-white'
          )}
        >
          {formattedDate}
        </div>
      </button>
    </td>
  )
}
