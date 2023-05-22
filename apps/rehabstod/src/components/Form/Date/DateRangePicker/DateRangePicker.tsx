import React from 'react'
import { AriaDateRangePickerProps, DateValue, useDateRangePicker } from 'react-aria'
import { useDateRangePickerState } from 'react-stately'
import { classNames } from '../../../../utils/classNames'
import { RangeCalendar } from '../../../Calendar/RangeCalendar'
import { Popover } from '../../../Popover/Popover'
import { PopoverContent } from '../../../Popover/PopoverContent'
import { PopoverTrigger } from '../../../Popover/PopoverTrigger'
import { TooltipIcon } from '../../../TooltipIcon/TooltipIcon'
import { useInputStyle } from '../../hooks/useInputStyle'
import { DateField } from '../DateField'
import { DatePickerButton } from '../DatePickerButton'

export function DateRangePicker({
  label,
  error,
  disabled,
  description,
  inline,
  ...props
}: AriaDateRangePickerProps<DateValue> & { error?: boolean; disabled?: boolean; description?: string; inline?: boolean }) {
  const style = useInputStyle({ error, disabled })
  const state = useDateRangePickerState(props)
  const ref = React.useRef(null)
  const { labelProps, groupProps, startFieldProps, endFieldProps, buttonProps, dialogProps, calendarProps } = useDateRangePicker(
    { label, ...props },
    state,
    ref
  )

  return (
    <Popover open={state.isOpen} onOpenChange={state.setOpen} placement="bottom-end">
      <div className={classNames('inline-flex w-full ', inline ? 'flex-row gap-3' : 'flex-col')}>
        <div>
          <span {...labelProps}>{label}</span>
          {description && <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />}
        </div>
        <div {...groupProps} ref={ref} className="flex grow">
          <PopoverTrigger asChild>
            <div {...groupProps} className={style}>
              <div className="inline-flex grow gap-1 px-5">
                <DateField
                  {...startFieldProps}
                  onFocus={() => {
                    state.setOpen(false)
                  }}
                />
                <span className="py-3 px-1">–</span>
                <DateField
                  {...endFieldProps}
                  onFocus={() => {
                    state.setOpen(false)
                  }}
                />
              </div>
              <DatePickerButton {...buttonProps} />
            </div>
          </PopoverTrigger>
          {state.isOpen && (
            <PopoverContent {...dialogProps}>
              <RangeCalendar {...calendarProps} />
            </PopoverContent>
          )}
        </div>
      </div>
    </Popover>
  )
}
