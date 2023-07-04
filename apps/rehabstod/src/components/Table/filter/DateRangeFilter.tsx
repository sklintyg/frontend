import { parseDate } from '@internationalized/date'
import { AriaDateRangePickerProps, DateValue } from 'react-aria'
import { DateRangePicker } from '../../Form/Date/DateRangePicker/DateRangePicker'
import { PrintTitle } from '../print/PrintTitle'

export function DateRangeFilter({
  fromDate,
  toDate,
  label,
  description,
  ...props
}: AriaDateRangePickerProps<DateValue> & {
  fromDate: string | null
  toDate: string | null
  label: string
  description: string
}) {
  return (
    <>
      <div className="print:hidden">
        <DateRangePicker
          value={fromDate && toDate ? { start: parseDate(fromDate), end: parseDate(toDate) } : null}
          onChange={(value) => {
            if (props && props.onChange) {
              props.onChange(value)
            }
          }}
          label={label}
          description={description}
          flex
        />
      </div>
      <div className="hidden print:block">
        <PrintTitle title={label} />
        {fromDate} - {toDate}
      </div>
    </>
  )
}
