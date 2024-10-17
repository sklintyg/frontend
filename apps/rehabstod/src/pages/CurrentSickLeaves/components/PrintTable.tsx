import { classNames } from 'components'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import type { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { useLogPrintInteractionMutation } from '../../../store/sickLeaveApi'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
import { useSickLeavesTableColumn } from '../hooks/useSickLeavesTableColumns'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'
import { ResolvePrintTableCell } from './ResolvePrintTableCell'

const COLUMN_LENGTH = 5

export function PrintTable({ sickLeaves, tableInfo, title }: { sickLeaves?: SickLeaveInfo[]; tableInfo: ReactNode; title: string }) {
  const { sortTableList, sortColumn, ascending } = useTableContext()
  const [logPrintInteractionTrigger] = useLogPrintInteractionMutation()
  const columns = useSickLeavesTableColumn()

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
        <div
          key={sickLeave.patient.id}
          data-testid="sickleave-row"
          className={classNames(
            '-mb-px flex break-inside-avoid gap-2 border border-neutral-40 p-4',
            isDateBeforeToday(sickLeave.slut) && 'italic'
          )}
        >
          {Array.from({ length: COLUMN_LENGTH }, (_, index) => ({ id: index })).map(({ id }) => (
            <div key={id} className="min-w-0 flex-1">
              {columns
                .filter((_, index) => index % COLUMN_LENGTH === id)
                .map(({ name }) => (
                  <div key={name} className="flex gap-2">
                    <strong>{name === 'Personnummer' ? 'Personnr' : name} </strong>
                    <div key={name} className="w-56 min-w-0">
                      <ResolvePrintTableCell column={name} sickLeave={sickLeave} sickLeaves={sortedList} />
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
