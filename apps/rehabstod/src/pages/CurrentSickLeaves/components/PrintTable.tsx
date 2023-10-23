import { ReactNode, useEffect } from 'react'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { useAppSelector } from '../../../store/hooks'
import { useLogPrintInteractionMutation } from '../../../store/sickLeaveApi'
import { allSickLeaveColumns } from '../../../store/slices/sickLeaveTableColumns.selector'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'
import { ResolvePrintTableCell } from './ResolvePrintTableCell'

export function PrintTable({
  sickLeaves,
  tableInfo,
  showPersonalInformation,
  title,
}: {
  sickLeaves?: SickLeaveInfo[]
  tableInfo: ReactNode
  showPersonalInformation: boolean
  title: string
}) {
  const { sortTableList, sortColumn, ascending } = useTableContext()
  const columns = useAppSelector(allSickLeaveColumns)
  const [logPrintInteractionTrigger] = useLogPrintInteractionMutation()

  useEffect(() => {
    const logPrintInteraction = () => {
      logPrintInteractionTrigger({ sickLeaves })
    }
    window.addEventListener('afterprint', logPrintInteraction)
    return () => {
      window.removeEventListener('afterprint', logPrintInteraction)
    }
  })

  if (!sickLeaves) {
    return null
  }

  const sortedList = sortTableList(sickLeaves, getSickLeavesColumnData)

  return (
    <div className="hidden print:block">
      <h3 className="ids-heading-4">{title}</h3>
      <div className="mb-2 flex">
        <div className="w-1/2 whitespace-nowrap">{tableInfo}</div>
        <div className="w-1/2 whitespace-nowrap text-right">
          Tabellen är sorterad enligt <span className="font-bold">{sortColumn}</span> i {ascending ? 'stigande' : 'fallande'} ordning
        </div>
      </div>

      {sortedList?.map((sickLeave) => (
        <div key={sickLeave.patient.id} className="-mb-px columns-5 break-inside-avoid gap-2 border border-neutral-40 p-4">
          {columns
            .filter(({ name }) => !(!showPersonalInformation && name === SickLeaveColumn.Personnummer))
            .filter(({ name }) => !(!showPersonalInformation && name === SickLeaveColumn.Namn))
            .map(
              ({ name, visible }) =>
                visible && (
                  <div key={name} className="flex gap-1">
                    <div className="w-5/12 font-bold">{name === 'Personnummer' ? 'Personnr' : name}</div>
                    <div key={name} className="w-7/12 truncate">
                      <ResolvePrintTableCell column={name} sickLeave={sickLeave} sickLeaves={sortedList} />
                    </div>
                  </div>
                )
            )}
        </div>
      ))}
    </div>
  )
}
