import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { SelectFilter } from '../../../../components/Table/filter/SelectFilter'
import { RekoStatusType } from '../../../../schemas/sickLeaveSchema'
import { useSetRekoStatusMutation } from '../../../../store/api'
import { useAppSelector } from '../../../../store/hooks'
import { getRekoStatusSickLeaveTimestamp } from '../../../../utils/getRekoStatusSickLeaveTimestamp'
import { updateRekoStatusId } from '../../../../store/slices/sickLeave.slice'

export function SelectRekoStatus({
  patientId,
  endDate,
  rekoStatusTypes,
  description,
  disabled = false,
}: {
  patientId: string
  endDate: string
  rekoStatusTypes: RekoStatusType[]
  description: string
  disabled?: boolean
}) {
  const [setRekoStatus] = useSetRekoStatusMutation()
  const { rekoStatusId } = useAppSelector((rootState) => rootState.sickLeave)
  const emptyRekoStatus = rekoStatusTypes.find((rekoStatusType) => rekoStatusType.name === 'Ingen')
  const [savedRekoStatus, updateSavedRekoStatus] = useState(rekoStatusId || emptyRekoStatus?.id)
  const sickLeaveTimestamp = getRekoStatusSickLeaveTimestamp(endDate)
  const { filter } = useAppSelector((state) => state.sickLeave)
  const dispatch = useDispatch()

  const handleSetRekoStatus = (id: string) => {
    const type = rekoStatusTypes.find((rekoStatusType) => id === rekoStatusType.id)
    if (type) {
      setRekoStatus({ patientId, status: type, sickLeaveTimestamp, filter })
      updateSavedRekoStatus(type.id)
      dispatch(updateRekoStatusId(type.id))
    }
  }

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
