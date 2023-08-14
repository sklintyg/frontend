import { classNames, useInputStyle } from '@frontend/components'
import { IDSIconQuestion } from '@frontend/ids-react-ts'
import React from 'react'
import { AriaDateRangePickerProps, DateValue, useDateRangePicker } from 'react-aria'
import { useDateRangePickerState } from 'react-stately'
import { RangeCalendar } from '../../../Calendar/RangeCalendar'
import { Popover } from '../../../Popover/Popover'
import { PopoverContent } from '../../../Popover/PopoverContent'
import { TooltipIcon } from '../../../TooltipIcon/TooltipIcon'
import { DateField } from '../DateField'
import { DatePickerButton } from '../DatePickerButton'

export function DateRangePicker({
  label,
  error,
  disabled,
  description,
  inline,
  flex,
  ...props
}: AriaDateRangePickerProps<DateValue> & { error?: boolean; disabled?: boolean; description?: string; inline?: boolean; flex?: boolean }) {
  const style = useInputStyle({ error, disabled, flex })
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
          {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="relative top-1 ml-2" />} />}
        </div>
        <div {...groupProps} ref={ref} className={style}>
          <div className="inline-flex w-full gap-1 pl-5">
            <DateField {...startFieldProps} />
            <span className="py-3 px-1">till</span>
            <DateField {...endFieldProps} />
          </div>
          <DatePickerButton {...buttonProps} />
        </div>
        {state.isOpen && (
          <PopoverContent {...dialogProps}>
            <RangeCalendar {...calendarProps} />
          </PopoverContent>
        )}
      </div>
    </Popover>
  )
}
