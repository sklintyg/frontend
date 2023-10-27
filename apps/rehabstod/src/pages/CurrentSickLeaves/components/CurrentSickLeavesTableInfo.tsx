import { IDSButton } from '@frontend/ids-react-ts'
import { TableInfoItem } from '../../../components/Table/TableInfo/TableInfoItem'
import { TableRowsInfoItem } from '../../../components/Table/TableInfo/TableRowsInfoItem'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowSettingsDialog } from '../../../store/slices/settings.slice'

export function CurrentSickLeavesTableInfo({
  daysBetweenCertificates,
  daysAfterSickLeaveEnd,
  listLength,
  totalNumber,
}: {
  daysBetweenCertificates: string
  daysAfterSickLeaveEnd: string
  listLength: number
  totalNumber: number
}) {
  const dispatch = useAppDispatch()

  return (
    <>
      <TableRowsInfoItem listLength={listLength} totalNumber={totalNumber} />
      <TableInfoItem>
        <span className="font-bold">{daysBetweenCertificates} dagar</span> mellan intyg
      </TableInfoItem>
      <TableInfoItem noPrintAfter>
        Sjukfall visas i <span className="font-bold">{daysAfterSickLeaveEnd} dagar</span> efter slutdatum
      </TableInfoItem>
      <div className="print:hidden">
        <IDSButton onClick={() => dispatch(updateShowSettingsDialog(true))} tertiary size="s">
          Ändra
        </IDSButton>
      </div>
    </>
  )
}
