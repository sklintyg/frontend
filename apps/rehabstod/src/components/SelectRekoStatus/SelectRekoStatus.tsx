import { useState } from 'react'
import { useSetRekoStatusMutation } from '../../store/api'
import { RekoStatus, RekoStatusType } from '../../schemas/sickLeaveSchema'
import { getRekoStatusSickLeaveTimestamp } from '../../utils/getRekoStatusSickLeaveTimestamp'
import { SelectFilter } from '../Table/filter/SelectFilter'

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
  const emptyRekoStatus = rekoStatusTypes.find((rekoStatusType) => rekoStatusType.name === 'Ingen')
  const [savedRekoStatus, updateSavedRekoStatus] = useState(
    statusFromSickLeave && statusFromSickLeave.status ? statusFromSickLeave.status.id : emptyRekoStatus?.id
  )
  const sickLeaveTimestamp = getRekoStatusSickLeaveTimestamp(endDate)
  const { filter } = useAppSelector((state) => state.sickLeave)

  const handleSetRekoStatus = (id: string) => {
    const type = rekoStatusTypes.find((rekoStatusType) => id === rekoStatusType.id)
    if (type) {
      setRekoStatus({ patientId, status: type, sickLeaveTimestamp, filter })
      updateSavedRekoStatus(type.id)
    }
  }

  return (
    <SelectFilter
      value={savedRekoStatus || ''}
      onChange={(id) => handleSetRekoStatus(id)}
      options={rekoStatusTypes}
      hideDefaultValue
      description="Med REKO-status kan du som rehabkoordinator ange patientens nuvarande status. Dina ändringar visas även i sjukfallstabellen och kommer sparas tills vidare."
      label="REKO-status"
    />
  )
}
