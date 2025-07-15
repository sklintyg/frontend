import { useState } from 'react'
import type { RekoStatus, RekoStatusType } from '../../schemas/sickLeaveSchema'
import { useAppSelector } from '../../store/hooks'
import { useGetSickLeavesFiltersQuery, useSetRekoStatusMutation } from '../../store/sickLeaveApi'
import { getRekoStatusSickLeaveTimestamp } from '../../utils/getRekoStatusSickLeaveTimestamp'
import { SelectButton } from '../form/SelectButton'

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

  const handleSetRekoStatus = (type: RekoStatusType) => {
    setRekoStatus({ patientId, status: type, sickLeaveTimestamp, filter })
    updateSavedRekoStatus(type.name)
    setOpen(false)
  }

  return (
    <SelectButton title={savedRekoStatus} open={open} handleOpenChange={(isOpen) => setOpen(isOpen)}>
      {populatedFilters.rekoStatusTypes.map((type) => (
        <button
          key={type.id}
          onClick={(event) => {
            event.stopPropagation()
            handleSetRekoStatus(type)
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') {
              event.stopPropagation()
            }
            if (event.key === 'Enter' || event.key === 'Space') {
              handleSetRekoStatus(type)
            }
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              if (event.currentTarget.nextSibling instanceof HTMLElement) {
                event.currentTarget.nextSibling.focus()
              } else if (event.currentTarget.parentNode?.firstChild instanceof HTMLElement) {
                event.currentTarget.parentNode?.firstChild.focus()
              }
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault()
              if (event.currentTarget.previousSibling instanceof HTMLElement) {
                event.currentTarget.previousSibling.focus()
              } else if (event.currentTarget.parentNode?.lastChild instanceof HTMLElement) {
                event.currentTarget.parentNode?.lastChild.focus()
              }
            }
          }}
          type="button"
          className="py-1 text-left hover:bg-accent-90"
        >
          <span className="px-2">{type.name}</span>
        </button>
      ))}
    </SelectButton>
  )
}
