import { AriaDateRangePickerProps, DateValue } from 'react-aria'
import { useDateRangePickerState } from 'react-stately'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'
import { DatePicker } from './DatePicker/DatePicker'

export function DateRangeInput({
  title,
  description,
  ...props
}: { title: string; description: string } & AriaDateRangePickerProps<DateValue>) {
  const { value, setDate, dateRange, setDateRange, validationState } = useDateRangePickerState(props)
  return (
    <div>
      <div>
        <span>{title}</span>
        <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />
      </div>
      <div className="flex gap-3">
        <DatePicker
          label="Från"
          value={value.start}
          onChange={(val) => (dateRange ? setDate('start', val) : setDateRange({ start: val, end: val.add({ days: 1 }) }))}
        />
        <DatePicker
          label="Till"
          value={value.end}
          minValue={value.start}
          onChange={(val) => setDate('end', val)}
          error={validationState === 'invalid'}
        />
      </div>
    </div>
  )
}
