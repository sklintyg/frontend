import { ReactNode } from 'react'
import { ShowPersonalInformationFilter } from './filter/ShowPersonalInformationFilter'
import { TableInfoDivider } from './TableInfoDivider'

export function TableInfo({
  onShowPersonalInformationChange,
  listLength,
  totalNumber,
  showPersonalInformation,
  children,
}: {
  onShowPersonalInformationChange?: (checked: boolean) => void
  showPersonalInformation?: boolean
  listLength: number
  totalNumber: number
  children?: ReactNode
}) {
  return (
    <div className="mb-5 print:mb-0">
      <div className="print:hidden">
        {onShowPersonalInformationChange && (
          <ShowPersonalInformationFilter
            checked={showPersonalInformation}
            onChange={(checked) => onShowPersonalInformationChange(checked)}
          />
        )}
      </div>
      <div className="mt-5 hidden print:block" />
      <div className="flex gap-1">
        <span>
          Visar{' '}
          <span className="font-bold">
            {listLength} av {totalNumber}
          </span>
        </span>
        {children && <TableInfoDivider />}
        {children}
      </div>
    </div>
  )
}
