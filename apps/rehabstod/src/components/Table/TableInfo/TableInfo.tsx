import { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { updateShowPersonalInformation } from '../../../store/slices/settings.slice'
import { UnansweredCommunicationAlert } from '../../error/ErrorAlert/UnansweredCommunicationAlert'
import { TableInfoLeft } from './TableInfoLeft'
import { TableInfoRight } from './TableInfoRight'

export function TableInfo({
  children,
  listLength,
  totalNumber,
  modifyTable,
  printable = false,
  communicationError = false,
}: {
  children?: ReactNode
  listLength: number
  totalNumber: number
  modifyTable: ReactNode
  printable?: boolean
  communicationError?: boolean
}) {
  const { showPersonalInformation } = useAppSelector((state) => state.settings)
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-5 lg:flex-col-reverse lg:gap-10">
      <div className="md:flex">
        <TableInfoRight
          onShowPersonalInformationChange={(checked) => {
            dispatch(updateShowPersonalInformation(checked))
          }}
          showPersonalInformation={showPersonalInformation}
          listLength={listLength}
          totalNumber={totalNumber}
        >
          {children}
        </TableInfoRight>
        <TableInfoLeft printable={printable} modifyTable={modifyTable} />
      </div>
      {communicationError && (
        <div>
          <UnansweredCommunicationAlert />
        </div>
      )}
    </div>
  )
}
