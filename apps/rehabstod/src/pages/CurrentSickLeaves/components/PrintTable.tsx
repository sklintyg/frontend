import { useEffect } from 'react'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { useAppSelector } from '../../../store/hooks'
import { useLogPrintInteractionMutation } from '../../../store/sickLeaveApi'
import { allSickLeaveColumns } from '../../../store/slices/sickLeaveTableColumns.selector'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'
import { ResolvePrintTableCell } from './ResolvePrintTableCell'

export function PrintTable({ sickLeaves, showPersonalInformation }: { sickLeaves?: SickLeaveInfo[]; showPersonalInformation: boolean }) {
  const { sortTableList } = useTableContext()
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

  return (
    <div>
      {sortTableList(sickLeaves, getSickLeavesColumnData)?.map((sickLeave) => (
        <div key={sickLeave.patient.id} className="-mb-px columns-3 break-inside-avoid gap-2 border border-neutral-40 p-4">
          {columns
            .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Personnummer))
            .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Namn))
            .map(
              ({ name, visible }) =>
                visible && (
                  <div key={name} className="flex gap-1">
                    <div className="w-5/12 font-bold">{name}:</div>
                    <div key={name} className="w-7/12 overflow-hidden text-ellipsis whitespace-normal">
                      <ResolvePrintTableCell column={name} sickLeave={sickLeave} />
                    </div>
                  </div>
                )
            )}
        </div>
      ))}
    </div>
  )
}
