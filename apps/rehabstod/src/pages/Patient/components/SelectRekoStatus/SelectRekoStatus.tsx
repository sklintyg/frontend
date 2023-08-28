import { useEffect, useState } from 'react'
import { SelectFilter } from '../../../../components/Table/filter/SelectFilter'
import { RekoStatusType } from '../../../../schemas/sickLeaveSchema'
import { useAppSelector } from '../../../../store/hooks'
import { useGetRekoStatusForPatientQuery, useSetRekoStatusMutation } from '../../../../store/sickLeaveApi'
import { getRekoStatusSickLeaveTimestamp } from '../../../../utils/getRekoStatusSickLeaveTimestamp'

export function SelectRekoStatus({
  patientId,
  endDate,
  startDate,
  rekoStatusTypes,
  description,
  disabled = false,
}: {
  patientId: string
  endDate: string
  startDate: string
  rekoStatusTypes: RekoStatusType[]
  description: string
  disabled?: boolean
}) {
  const [setRekoStatus] = useSetRekoStatusMutation()
  const { data: rekoStatusFromDatabase } = useGetRekoStatusForPatientQuery({ patientId, endDate, startDate })
  const emptyRekoStatus = rekoStatusTypes.find((rekoStatusType) => rekoStatusType.name === 'Ingen')
  const [savedRekoStatus, updateSavedRekoStatus] = useState(rekoStatusFromDatabase?.status.id || emptyRekoStatus?.id)
  const sickLeaveTimestamp = getRekoStatusSickLeaveTimestamp(endDate)
  const { filter } = useAppSelector((state) => state.sickLeave)

  const handleSetRekoStatus = (id: string) => {
    const type = rekoStatusTypes.find((rekoStatusType) => id === rekoStatusType.id)
    if (type) {
      setRekoStatus({ patientId, status: type, sickLeaveTimestamp, filter })
      updateSavedRekoStatus(type.id)
    }
  }

  useEffect(() => {
    updateSavedRekoStatus(rekoStatusFromDatabase?.status.id)
  }, [rekoStatusFromDatabase])

  return (
    <SelectFilter
      disabled={disabled}
      value={savedRekoStatus || ''}
      onChange={(id) => handleSetRekoStatus(id)}
      options={rekoStatusTypes}
      hideDefaultValue
      description={description}
      label="REKO-status"
    />
  )
}
