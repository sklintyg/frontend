import { IDSButton } from '@frontend/ids-react-ts'
import { TableInfo } from '../../../components/Table/TableInfo'
import { TableInfoDivider } from '../../../components/Table/TableInfoDivider'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowSettingsDialog } from '../../../store/slices/settings.slice'

export function CurrentSickLeavesTableInfo({
  onShowPersonalInformationChange,
  listLength,
  totalNumber,
  daysBetweenCertificates,
  daysAfterSickLeaveEnd,
  showPersonalInformation,
}: {
  onShowPersonalInformationChange: (checked: boolean) => void
  showPersonalInformation: boolean
  listLength: number
  totalNumber: number
  daysBetweenCertificates: string
  daysAfterSickLeaveEnd: string
}) {
  const dispatch = useAppDispatch()

  return (
    <TableInfo
      showPersonalInformation={showPersonalInformation}
      onShowPersonalInformationChange={onShowPersonalInformationChange}
      listLength={listLength}
      totalNumber={totalNumber}
    >
      <span className="font-bold">{daysBetweenCertificates} dagar</span> mellan intyg
      <TableInfoDivider />
      <span>
        Sjukfall visas i <span className="font-bold">{daysAfterSickLeaveEnd} dagar</span> efter slutdatum
      </span>
      <div className="print:hidden">
        <TableInfoDivider />
        <IDSButton onClick={() => dispatch(updateShowSettingsDialog(true))} tertiary size="s">
          Ändra
        </IDSButton>
      </div>
    </TableInfo>
  )
}
