import { useInputStyle } from '@frontend/components'
import React from 'react'
import { AriaDatePickerProps, DateValue, useDatePicker } from 'react-aria'
import { useDatePickerState } from 'react-stately'
import { Calendar } from '../../../Calendar/Calendar'
import { Popover } from '../../../Popover/Popover'
import { PopoverContent } from '../../../Popover/PopoverContent'
import { DateField } from '../DateField'
import { DatePickerButton } from '../DatePickerButton'

export function DatePicker({ label, error, disabled, ...props }: AriaDatePickerProps<DateValue> & { error?: boolean; disabled?: boolean }) {
  const style = useInputStyle({ error, disabled })
  const state = useDatePickerState(props)
  const ref = React.useRef(null)
  const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps } = useDatePicker({ label, ...props }, state, ref)

  return (
    <Popover open={state.isOpen} onOpenChange={state.setOpen} placement="bottom-end">
      <div className="inline-flex w-full flex-row items-center gap-3">
        <div {...labelProps}>{label}</div>
        <div {...groupProps} ref={ref} className={style}>
          <span className="grow px-5">
            <DateField {...fieldProps} />
          </span>
          <DatePickerButton {...buttonProps} />
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
