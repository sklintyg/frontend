import { IDSButton } from '@frontend/ids-react-ts'
import React from 'react'
import { AriaDatePickerProps, DateValue, useDatePicker } from 'react-aria'
import { useDatePickerState } from 'react-stately'
import { Calendar } from '../Calendar/Calendar'
import { Popover } from '../Popover/Popover'
import { PopoverContent } from '../Popover/PopoverContent'
import { PopoverTrigger } from '../Popover/PopoverTrigger'
import { DateField } from './DateField'

export function DatePicker({ label, ...props }: AriaDatePickerProps<DateValue>) {
  const state = useDatePickerState(props)
  const ref = React.useRef(null)
  const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps } = useDatePicker(props, state, ref)

  return (
    <Popover open={state.isOpen} onOpenChange={state.setOpen}>
      <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
        <div {...labelProps}>{label}</div>
        <PopoverTrigger asChild>
          <div {...groupProps} style={{ display: 'flex' }}>
            <DateField {...fieldProps} />
            <IDSButton {...buttonProps}>🗓</IDSButton>
          </div>
        </PopoverTrigger>
        {state.isOpen && (
          <PopoverContent {...dialogProps}>
            <Calendar {...calendarProps} />
          </PopoverContent>
        )}
      </div>
    </Popover>
  )
}
