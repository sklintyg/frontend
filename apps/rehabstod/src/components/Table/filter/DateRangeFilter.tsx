import { DateRangePicker } from '../../Form/Date/DateRangePicker/DateRangePicker'
import { PrintTitle } from '../print/PrintTitle'

export function DateRangeFilter({
  fromDate,
  toDate,
  label,
  description,
  onDataChanged,
}: {
  fromDate: string | null
  toDate: string | null
  label: string
  description: string
  onDataChanged?: ({ start, end }: { start?: string | null; end?: string | null }) => void
}) {
  return (
    <>
      <div className="print:hidden">
        <DateRangePicker startDate={fromDate} endDate={toDate} onDataChanged={onDataChanged} label={label} description={description} flex />
      </div>
      <div className="hidden print:block">
        <PrintTitle title={label} />
        {fromDate} - {toDate}
      </div>
    </>
  )
}
