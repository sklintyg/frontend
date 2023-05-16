import React from 'react'
import { AriaDatePickerProps, DateValue, useDatePicker } from 'react-aria'
import { useDatePickerState } from 'react-stately'
import { classNames } from '../../../utils/classNames'
import { Calendar } from '../../Calendar/Calendar'
import { Popover } from '../../Popover/Popover'
import { PopoverContent } from '../../Popover/PopoverContent'
import { PopoverTrigger } from '../../Popover/PopoverTrigger'
import { DateField } from './DateField'
import { DatePickerButton } from './DatePickerButton'

const getStyle = ({ error = false, disabled = false }: Record<string, boolean | undefined>) => {
  if (disabled) {
    return 'bg-white border-neutral-40'
  }

  if (error) {
    return 'bg-error-99 border-error-40'
  }

  return 'bg-secondary-95 border-accent-40'
}

export function DatePicker({ label, error, disabled, ...props }: AriaDatePickerProps<DateValue> & { error?: boolean; disabled?: boolean }) {
  const state = useDatePickerState(props)
  const ref = React.useRef(null)
  const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps } = useDatePicker({ label, ...props }, state, ref)

  return (
    <Popover open={state.isOpen} onOpenChange={state.setOpen} placement="bottom-end">
      <div className="inline-flex w-full flex-row items-center gap-3">
        <div {...labelProps}>{label}</div>
        <PopoverTrigger asChild>
          <div
            {...groupProps}
            className={classNames('text-neutral-20 my-3 box-border flex w-full rounded border text-left', getStyle({ error, disabled }))}>
            <DateField
              {...fieldProps}
              onFocus={() => {
                state.setOpen(false)
              }}
            />
            <DatePickerButton {...buttonProps} />
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
