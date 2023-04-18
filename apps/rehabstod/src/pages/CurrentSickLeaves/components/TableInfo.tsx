import { IDSButton } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { Checkbox } from '../../../components/Form/Checkbox'
import { SettingsDialog } from '../../../components/SettingsDialog/SettingsDialog'
import { useGetUserQuery } from '../../../store/api'

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
  const { data: user } = useGetUserQuery()
  const [showSettingsDialog, setShowSettingsDialog] = useState('false')

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
        <SettingsDialog
          show={showSettingsDialog}
          onClose={() => setShowSettingsDialog('false')}
          preferences={user ? user.preferences : undefined}>
          <IDSButton trigger="" tertiary size="s" onClick={() => setShowSettingsDialog('true')}>
            Ändra
          </IDSButton>
        </SettingsDialog>
      </div>
    </div>
  )
}
