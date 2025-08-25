import { parseDate } from '@internationalized/date'
import { useRef } from 'react'
import type { AriaDatePickerProps, DateValue } from 'react-aria'
import { useDatePicker } from 'react-aria'
import { useDatePickerState } from 'react-stately'
import { isValidDate } from '../../../../utils/isValidDate'
import { Button } from '../../../Button/Button'
import { Calendar } from '../../../Calendar/Calendar'
import { Popover } from '../../../Popover/Popover'
import { PopoverContent } from '../../../Popover/PopoverContent'
import { DateField } from '../DateField'
import { DatePickerButton } from '../DatePickerButton'
import { useDateFieldFocus } from '../hooks/useDateFieldFocus'

interface DatePickerProps extends AriaDatePickerProps<DateValue> {
  error?: boolean
  disabled?: boolean
  date?: string | null
  onDataChanged?: (date?: string | null) => void
}

export function DatePicker({ label, error, disabled, date, onDataChanged, ...props }: DatePickerProps) {
  const onChange: (typeof props)['onChange'] = (val) => {
    if (onDataChanged) {
      onDataChanged(val?.toString())
    }
    if (props.onChange) {
      props.onChange(val)
    }
  }
  const value = isValidDate(date) ? parseDate(date) : null
  const state = useDatePickerState({ ...props, value, onChange })
  const ref = useRef(null)
  const fieldRef = useRef(null)
  const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps } = useDatePicker({ label, ...props }, state, ref)
  useDateFieldFocus(fieldRef)

  return (
    <Popover open={state.isOpen} onOpenChange={state.setOpen} placement="bottom-end">
      <div className="inline-flex w-full flex-row items-center gap-3">
        <div {...labelProps}>{label}</div>
        <div {...groupProps} ref={ref} className="ids-input">
          <span className="grow px-5" ref={fieldRef}>
            <DateField {...fieldProps} data={date} onDataChanged={(val) => onDataChanged && onDataChanged(val)} />
          </span>
          <DatePickerButton {...buttonProps} onPress={() => state.setOpen(!state.isOpen)} />
        </div>
        {state.isOpen && (
          <PopoverContent {...dialogProps}>
            <Calendar {...calendarProps} />
            <Button size="s" block secondary onClick={() => onDataChanged && onDataChanged(null)}>
              Återställ
            </Button>
          </PopoverContent>
        )}
      </div>
    </Popover>
  )
}
