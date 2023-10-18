import { TooltipIcon, classNames, useInputStyle } from '@frontend/components'
import { IDSButton, IDSIconQuestion } from '@frontend/ids-react-ts'
import { parseDate } from '@internationalized/date'
import { useRef } from 'react'
import { AriaDateRangePickerProps, DateValue, useDateRangePicker } from 'react-aria'
import { useDateRangePickerState } from 'react-stately'
import { isValidDate } from '../../../../utils/isValidDate'
import { RangeCalendar } from '../../../Calendar/RangeCalendar'
import { Popover } from '../../../Popover/Popover'
import { PopoverContent } from '../../../Popover/PopoverContent'
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
  disabled,
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
  const style = useInputStyle({ error, disabled })
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
        <div>
          <span {...labelProps}>{label}</span>
          {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="relative top-1 ml-2" />} />}
        </div>
        <div {...groupProps} ref={ref} className={`${style} flex`}>
          <div ref={fieldRef} className="inline-flex w-full gap-1 pl-5">
            <DateField
              {...startFieldProps}
              data={startDate}
              onDataChanged={(val) => onDataChanged && onDataChanged({ ...segmentData, start: val })}
            />
            <span className={classNames('hidden px-1 py-3 sm:inline-block', !(value?.start && value.end) && 'italic')}>till</span>
            <span className="px-1 py-3 sm:hidden">-</span>
            <DateField
              {...endFieldProps}
              data={endDate}
              onDataChanged={(val) => onDataChanged && onDataChanged({ ...segmentData, end: val })}
            />
          </div>
          <DatePickerButton {...buttonProps} onPress={() => state.setOpen(!state.isOpen)} />
        </div>
        {state.isOpen && (
          <PopoverContent {...dialogProps}>
            <RangeCalendar {...calendarProps} />
            <IDSButton size="s" block secondary onClick={() => onDataChanged && onDataChanged({ start: null, end: null })}>
              Återställ
            </IDSButton>
          </PopoverContent>
        )}
      </div>
    </Popover>
  )
}
