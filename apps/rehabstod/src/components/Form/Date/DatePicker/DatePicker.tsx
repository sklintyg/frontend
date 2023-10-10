import { useInputStyle } from '@frontend/components'
import { useRef } from 'react'
import { AriaDatePickerProps, DateValue, useDatePicker } from 'react-aria'
import { useDatePickerState } from 'react-stately'
import { Calendar } from '../../../Calendar/Calendar'
import { Popover } from '../../../Popover/Popover'
import { PopoverContent } from '../../../Popover/PopoverContent'
import { DateField } from '../DateField'
import { DatePickerButton } from '../DatePickerButton'
import { useDateFieldFocus } from '../hooks/useDateFieldFocus'

export function DatePicker({ label, error, disabled, ...props }: AriaDatePickerProps<DateValue> & { error?: boolean; disabled?: boolean }) {
  const style = useInputStyle({ error, disabled })
  const state = useDatePickerState(props)
  const ref = useRef(null)
  const fieldRef = useRef(null)
  const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps } = useDatePicker({ label, ...props }, state, ref)
  useDateFieldFocus(fieldRef)

  return (
    <Popover open={state.isOpen} onOpenChange={state.setOpen} placement="bottom-end">
      <div className="inline-flex w-full flex-row items-center gap-3">
        <div {...labelProps}>{label}</div>
        <div {...groupProps} ref={ref} className={style}>
          <span className="grow px-5" ref={fieldRef}>
            <DateField {...fieldProps} />
          </span>
          <DatePickerButton {...buttonProps} onPress={() => state.setOpen(!state.isOpen)} data-testid="calendar-button" />
        </div>
        {state.isOpen && (
          <PopoverContent {...dialogProps}>
            <Calendar {...calendarProps} />
          </PopoverContent>
        )}
      </div>
    </Popover>
  )
}
