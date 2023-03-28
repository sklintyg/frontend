import { ChangeEvent, useState } from 'react'
import { IDSButton } from '@frontend/ids-react-ts'
import { Checkbox } from '../../Form/Checkbox'

export function CurrentSickLeavesTableInfo({
  onShowPersonalInformation,
  listLength,
  totalNumber,
  daysBetweenCertificates,
  daysAfterSickLeaveEnd,
}: {
  onShowPersonalInformation: (isChecked: boolean) => void
  listLength: number
  totalNumber: number
  daysBetweenCertificates: string
  daysAfterSickLeaveEnd: string
}) {
  const [showPersonalInformation, setShowPersonalInformation] = useState(true)

  const handleHidePersonalInformation = (event: ChangeEvent<HTMLInputElement>) => {
    onShowPersonalInformation(event.currentTarget.checked)
    setShowPersonalInformation(event.currentTarget.checked)
  }

  return (
    <div className="mb-5">
      <Checkbox
        id="showPersonalInformationCheckbox"
        label="Visa personuppgifter"
        checked={showPersonalInformation}
        description="Visar eller döljer patienternas namn och personnummer i tabellen."
        onChange={(event) => handleHidePersonalInformation(event)}
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
        <IDSButton tertiary size="s" className="p-0">
          Ändra
        </IDSButton>
      </div>
    </div>
  )
}
