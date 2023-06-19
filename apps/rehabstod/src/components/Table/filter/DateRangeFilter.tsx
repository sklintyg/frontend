import { parseDate } from '@internationalized/date'
import { DateRangePicker } from '../../Form/Date/DateRangePicker/DateRangePicker'

export function DateRangeFilter({
  fromDate,
  toDate,
  label,
  description,
  onChange,
}: {
  fromDate: string
  toDate: string
  label: string
  description: string
  onChange: (value: string | null) => void
}) {
  return (
    <>
      <div className="print:hidden">
        <DateRangePicker
          value={fromDate && toDate ? { start: parseDate(fromDate), end: parseDate(toDate) } : null}
          onChange={(value) => onChange(value)}
          label={label}
          description={description}
        />
      </div>
      <div className="hidden print:block">
        <p className="font-bold">{label}:</p>
        {fromDate} - {toDate}
      </div>
    </>
  )
}
