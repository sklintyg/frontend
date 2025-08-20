import { DateRangePicker } from '../../form/Date/DateRangePicker/DateRangePicker'
import { PrintTitle } from '../print/PrintTitle'

export function DateRangeFilter({
  description,
  error,
  fromDate,
  label,
  onDataChanged,
  toDate,
}: {
  description: string
  error: boolean
  fromDate?: string | null
  label: string
  onDataChanged?: ({ start, end }: { start?: string | null; end?: string | null }) => void
  toDate?: string | null
}) {
  return (
    <>
      <div className="print:hidden">
        <DateRangePicker
          description={description}
          endDate={toDate}
          error={error}
          label={label}
          onDataChanged={onDataChanged}
          startDate={fromDate}
        />
      </div>
      <div className="hidden print:block">
        <PrintTitle title={label} />
        {fromDate} - {toDate}
      </div>
    </>
  )
}
