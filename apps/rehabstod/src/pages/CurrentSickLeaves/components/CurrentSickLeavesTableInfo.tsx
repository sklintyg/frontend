import { TableInfoItem } from '../../../components/Table/TableInfo/TableInfoItem'
import { TableRowsInfoItem } from '../../../components/Table/TableInfo/TableRowsInfoItem'
import { TertiaryButton } from '../../../components/TertiaryButton/TertiaryButton'
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
        <TertiaryButton onClick={() => dispatch(updateShowSettingsDialog(true))}>
          <span className="ids-icon-edit ids-icon--text-start" />
          Ändra
        </TertiaryButton>
      </div>
    </>
  )
}
