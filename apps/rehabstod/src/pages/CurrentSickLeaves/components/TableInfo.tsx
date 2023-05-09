import { IDSButton } from '@frontend/ids-react-ts'
import { Checkbox } from '../../../components/Form/Checkbox'
import { useAppDispatch } from '../../../store/hooks'
import { showSettingsDialog } from '../../../store/slices/settings.slice'

export function TableInfoDivider() {
  return (
    <span role="separator" aria-orientation="vertical" className="mx-1">
      |
    </span>
  )
}

export function TableInfo({
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
    <div className="mb-5 print:mb-0">
      <div className="print:hidden">
        <Checkbox
          label="Visa personuppgifter"
          checked={showPersonalInformation}
          description="Visar eller döljer patienternas namn och personnummer i tabellen."
          onChange={({ currentTarget: { checked } }) => {
            onShowPersonalInformationChange(checked)
          }}
        />
      </div>
      <div className="flex gap-1">
        <span>
          Visar{' '}
          <span className="font-bold">
            {listLength} av {totalNumber}
          </span>
        </span>
        <TableInfoDivider />
        <span className="font-bold">{daysBetweenCertificates} dagar</span> mellan intyg
        <TableInfoDivider />
        <span>
          Sjukfall visas i <span className="font-bold">{daysAfterSickLeaveEnd} dagar</span> efter slutdatum
        </span>
        <div className="print:hidden">
          <TableInfoDivider />
          <IDSButton onClick={() => dispatch(showSettingsDialog())} tertiary size="s">
            Ändra
          </IDSButton>
        </div>
      </div>
    </div>
  )
}
