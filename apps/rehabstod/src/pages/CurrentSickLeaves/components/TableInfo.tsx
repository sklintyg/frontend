import { Checkbox } from '../../../components/Form/Checkbox'
import { SettingsDialog } from './SettingsDialog'

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
  return (
    <div className="mb-5">
      <Checkbox
        id="showPersonalInformationCheckbox"
        label="Visa personuppgifter"
        checked={showPersonalInformation}
        description="Visar eller döljer patienternas namn och personnummer i tabellen."
        onChange={({ currentTarget: { checked } }) => {
          onShowPersonalInformationChange(checked)
        }}
      />
      <div className="flex">
        <p>
          Visar{' '}
          <span className="font-bold">
            {listLength} av {totalNumber}
          </span>
        </p>
        <p className="mx-2">|</p>
        <p>
          <span className="font-bold">{daysBetweenCertificates} dagar</span> mellan sjukfall
        </p>
        <p className="mx-2">|</p>
        <p>
          Sjukfall visas i <span className="font-bold">{daysAfterSickLeaveEnd} dagar</span> efter slutdatum
        </p>
        <p className="mx-2">|</p>
        <SettingsDialog />
      </div>
    </div>
  )
}
