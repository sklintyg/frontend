import { AriaDateRangePickerProps, DateValue } from 'react-aria'
import { useDateRangePickerState } from 'react-stately'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'
import { DatePicker } from './Date/DatePicker/DatePicker'

export function DateRangeInput({
  title,
  description,
  ...props
}: { title: string; description: string } & AriaDateRangePickerProps<DateValue>) {
  const {
    value: { start, end },
    setValue,
    validationState,
  } = useDateRangePickerState(props)
  return (
    <div>
      <div>
        <span>{title}</span>
        <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />
      </div>
      <div className="flex gap-3">
        <DatePicker label="Från" value={start} onChange={(val) => setValue({ start: val, end })} />
        <DatePicker
          label="Till"
          value={end}
          minValue={start}
          onChange={(val) => setValue({ start, end: val })}
          error={validationState === 'invalid'}
        />
      </div>
    </div>
  )
}
