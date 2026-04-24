import { DateRangePicker } from '@frontend/components'
import { PrintTitle } from '../print/PrintTitle'

export function DateRangeFilter({
  description,
  error,
  fromDate,
  label,
  onDataChanged,
  toDate,
  iconColorPreset,
}: {
  description: string
  error: boolean
  fromDate?: string | null
  label: string
  onDataChanged?: ({ start, end }: { start?: string | null; end?: string | null }) => void
  toDate?: string | null
  iconColorPreset?: 1 | 2 | 3 | 4
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
          iconColorPreset={iconColorPreset}
        />
      </div>
      <div className="hidden print:block">
        <PrintTitle title={label} />
        {fromDate} - {toDate}
      </div>
    </>
  )
}
