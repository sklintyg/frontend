import { useState } from 'react'
import { useSetRekoStatusMutation } from '../../store/api'
import { RekoStatus, RekoStatusType } from '../../schemas/sickLeaveSchema'
import { SelectFilter } from '../../pages/CurrentSickLeaves/components/filter/SelectFilter'
import { getRekoStatusSickLeaveTimestamp } from '../../utils/getRekoStatusSickLeaveTimestamp'

export function SelectRekoStatus({
  statusFromSickLeave,
  patientId,
  endDate,
  rekoStatusTypes,
}: {
  statusFromSickLeave: RekoStatus
  patientId: string
  endDate: string
  rekoStatusTypes: RekoStatusType[]
}) {
  const [setRekoStatus] = useSetRekoStatusMutation()
  const emptyRekoStatusId = rekoStatusTypes.find((rekoStatusType) => rekoStatusType.name === 'Ingen')
  const [savedRekoStatus, updateSavedRekoStatus] = useState(
    statusFromSickLeave && statusFromSickLeave.status ? statusFromSickLeave.status.id : emptyRekoStatusId
  )
  const sickLeaveTimestamp = getRekoStatusSickLeaveTimestamp(endDate)

  const handleSetRekoStatus = (id: string) => {
    const type = rekoStatusTypes.find((rekoStatusType) => id === rekoStatusType.id)
    if (type) {
      setRekoStatus({ patientId, status: type, sickLeaveTimestamp, filter: null })
      updateSavedRekoStatus(type.id)
    }
  }

  return (
    <SelectFilter
      value={savedRekoStatus}
      onChange={(id) => handleSetRekoStatus(id)}
      options={rekoStatusTypes}
      hideDefaultValue
      description="Beskrivning"
      label="REKO-status"
    />
  )
}
