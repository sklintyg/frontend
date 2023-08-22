import { IDSButton } from '@frontend/ids-react-ts'
import { TableInfo } from '../../../components/Table/TableInfo/TableInfo'
import { TableInfoItem } from '../../../components/Table/TableInfo/TableInfoItem'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowSettingsDialog } from '../../../store/slices/settings.slice'
import { ModifySicknessTableColumns } from './ModifySicknessTableColumns'

export function CurrentSickLeavesTableInfo({
  listLength,
  totalNumber,
  daysBetweenCertificates,
  daysAfterSickLeaveEnd,
  communicationError,
}: {
  listLength: number
  totalNumber: number
  daysBetweenCertificates: string
  daysAfterSickLeaveEnd: string
  communicationError?: boolean
}) {
  const dispatch = useAppDispatch()

  return (
    <TableInfo
      printable
      communicationError={communicationError}
      modifyTable={<ModifySicknessTableColumns />}
      listLength={listLength}
      totalNumber={totalNumber}
    >
      <TableInfoItem>
        <span className="font-bold">{daysBetweenCertificates} dagar</span> mellan intyg
      </TableInfoItem>
      <TableInfoItem>
        Sjukfall visas i <span className="font-bold">{daysAfterSickLeaveEnd} dagar</span> efter slutdatum
      </TableInfoItem>
      <div className="print:hidden">
        <IDSButton onClick={() => dispatch(updateShowSettingsDialog(true))} tertiary size="s">
          Ändra
        </IDSButton>
      </div>
    </TableInfo>
  )
}
