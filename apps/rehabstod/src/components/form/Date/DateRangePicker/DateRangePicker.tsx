import { IDSErrorMessage } from '@inera/ids-react'
import { parseDate } from '@internationalized/date'
import { useRef } from 'react'
import type { AriaDateRangePickerProps, DateValue } from 'react-aria'
import { useDateRangePicker } from 'react-aria'
import { useDateRangePickerState } from 'react-stately'
import { classNames } from '../../../../utils/classNames'
import { isValidDate } from '../../../../utils/isValidDate'
import { Button } from '../../../Button/Button'
import { RangeCalendar } from '../../../Calendar/RangeCalendar'
import { Popover } from '../../../Popover/Popover'
import { PopoverContent } from '../../../Popover/PopoverContent'
import { InputLabel } from '../../InputLabel/InputLabel'
import { DateField } from '../DateField'
import { DatePickerButton } from '../DatePickerButton'
import { useDateFieldFocus } from '../hooks/useDateFieldFocus'

interface DateRangePickerProps extends AriaDateRangePickerProps<DateValue> {
  error?: boolean
  disabled?: boolean
  description?: string
  inline?: boolean
  flex?: boolean
  startDate?: string | null
  endDate?: string | null
  onDataChanged?: ({ start, end }: { start?: string | null; end?: string | null }) => void
}

export function DateRangePicker({
  label,
  error,
  // disabled,
  description,
  inline,
  startDate,
  endDate,
  onDataChanged,
  ...props
}: DateRangePickerProps) {
  const onChange: (typeof props)['onChange'] = (val) => {
    if (onDataChanged) {
      onDataChanged({ start: val?.start.toString(), end: val?.end.toString() })
    }
    if (props.onChange) {
      props.onChange(val)
    }
  }
  const value = isValidDate(startDate) && isValidDate(endDate) ? { start: parseDate(startDate), end: parseDate(endDate) } : null
  const state = useDateRangePickerState({ value, ...props, onChange })
  const ref = useRef(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const { labelProps, groupProps, startFieldProps, endFieldProps, buttonProps, dialogProps, calendarProps } = useDateRangePicker(
    { label, value, onChange, ...props },
    state,
    ref
  )
  useDateFieldFocus(fieldRef)
  const segmentData = { start: value?.start.toString() || startDate, end: value?.end.toString() || endDate }

  return (
    <Popover open={state.isOpen} onOpenChange={state.setOpen} placement="bottom-end">
      <div className={classNames('inline-flex w-full ', inline ? 'flex-row gap-3' : 'flex-col')}>
        <InputLabel {...labelProps} description={description}>
          {label}
        </InputLabel>
        <div {...groupProps} ref={ref} className="ids-input ids-input--light flex">
          <div ref={fieldRef} className="inline-flex w-full gap-1 ">
            <DateField
              {...startFieldProps}
              data={startDate}
              onDataChanged={(val) => onDataChanged && onDataChanged({ ...segmentData, start: val })}
            />
            <span
              style={{ color: value?.start && value.end ? 'inherit' : 'var(--IDS-FORM-PLACEHOLDER__COLOR)' }}
              className="hidden px-1 py-1.5 sm:inline-block"
            >
              till
            </span>
            <span className="p-1.5 sm:hidden">-</span>
            <DateField
              {...endFieldProps}
              data={endDate}
              onDataChanged={(val) => onDataChanged && onDataChanged({ ...segmentData, end: val })}
            />
          </div>
          <DatePickerButton {...buttonProps} onPress={() => state.setOpen(!state.isOpen)} error={error} />
        </div>
        {state.isOpen && (
          <PopoverContent {...dialogProps}>
            <RangeCalendar {...calendarProps} />
            <Button size="s" block secondary onClick={() => onDataChanged && onDataChanged({ start: null, end: null })}>
              Återställ
            </Button>
          </PopoverContent>
        )}
        {error && <IDSErrorMessage>Du måste ange ett giltigt datum</IDSErrorMessage>}
      </div>
    </Popover>
  )
}
