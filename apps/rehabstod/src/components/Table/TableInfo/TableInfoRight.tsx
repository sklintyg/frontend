import { ReactNode } from 'react'
import { ShowPersonalInformationCheckbox } from './ShowPersonalInformationCheckbox'
import { TableInfoItem } from './TableInfoItem'

export function TableInfoRight({
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
    <div className="w-full">
      <div className="mb-5 flex flex-col gap-5 print:mb-0 md:flex-col-reverse">
        <div className="flex flex-col xl:flex-row">
          <TableInfoItem>
            Visar{' '}
            <span className="font-bold">
              {listLength} av {totalNumber}
            </span>
          </TableInfoItem>
          {children}
        </div>
        <div className="mt-5 hidden print:block" />
        <div className="print:hidden">
          {onShowPersonalInformationChange && (
            <ShowPersonalInformationCheckbox
              checked={!!showPersonalInformation}
              onChange={(checked) => onShowPersonalInformationChange(checked)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
