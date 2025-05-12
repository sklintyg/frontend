import type { MouseEvent } from 'react'
import { useState } from 'react'
import type { RekoStatus, RekoStatusType } from '../../schemas/sickLeaveSchema'
import { useAppSelector } from '../../store/hooks'
import { useGetSickLeavesFiltersQuery, useSetRekoStatusMutation } from '../../store/sickLeaveApi'
import { getRekoStatusSickLeaveTimestamp } from '../../utils/getRekoStatusSickLeaveTimestamp'
import { SelectButton } from '../Form/SelectButton'

export function RekoStatusDropdown({
  statusFromSickLeave,
  patientId,
  endDate,
}: {
  statusFromSickLeave: RekoStatus
  patientId: string
  endDate: string
}) {
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const [setRekoStatus] = useSetRekoStatusMutation()
  const [savedRekoStatus, updateSavedRekoStatus] = useState(statusFromSickLeave ? statusFromSickLeave.status.name : '-')
  const sickLeaveTimestamp = getRekoStatusSickLeaveTimestamp(endDate)
  const { filter } = useAppSelector((state) => state.sickLeaveFilter)
  const [open, setOpen] = useState(false)

  if (!populatedFilters || !populatedFilters.rekoStatusTypes) {
    return null
  }

  const handleSetRekoStatus = (event: MouseEvent, type: RekoStatusType) => {
    event.stopPropagation()
    setRekoStatus({ patientId, status: type, sickLeaveTimestamp, filter })
    updateSavedRekoStatus(type.name)
    setOpen(false)
  }

  return (
    <SelectButton title={savedRekoStatus} open={open} handleOpenChange={(isOpen) => setOpen(isOpen)}>
      {populatedFilters.rekoStatusTypes.map((type) => (
        <button
          key={type.id}
          onClick={(event) => handleSetRekoStatus(event, type)}
          type="button"
          className="py-1 text-left hover:bg-secondary-95"
        >
          <span className="px-2">{type.name}</span>
        </button>
      ))}
    </SelectButton>
  )
}
