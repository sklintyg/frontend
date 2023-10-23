import { ReactNode } from 'react'
import { ShowPersonalInformationCheckbox } from './ShowPersonalInformationCheckbox'

export function TableInfoRight({
  onShowPersonalInformationChange,
  showPersonalInformation,
  children,
}: {
  onShowPersonalInformationChange?: (checked: boolean) => void
  showPersonalInformation?: boolean
  children?: ReactNode
}) {
  return (
    <div className="w-full">
      <div className="mb-5 flex flex-col gap-5 print:mb-0 xl:flex-col-reverse">
        <div className="flex flex-col print:mb-5 print:flex-row xl:flex-row">{children}</div>
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
