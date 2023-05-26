import { MouseEvent, useEffect, useRef, useState } from 'react'
import { format, isAfter } from 'date-fns'
import { useGetPopulatedFiltersQuery, useSetRekoStatusMutation } from '../../store/api'
import { RekoStatus, RekoStatusType } from '../../schemas/sickLeaveSchema'
import { SelectButton } from '../Form/SelectButton'
import { useAppSelector } from '../../store/hooks'

export function RekoStatusDropdown({
  statusFromSickLeave,
  patientId,
  endDate,
}: {
  statusFromSickLeave: RekoStatus
  patientId: string
  endDate: string
}) {
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
  const [setRekoStatus] = useSetRekoStatusMutation()
  const [savedRekoStatus, updateSavedRekoStatus] = useState(statusFromSickLeave ? statusFromSickLeave.status.name : 'Ingen')
  const sickLeaveTimestamp = isAfter(new Date(endDate), new Date()) ? format(new Date(), 'yyyy-MM-dd') : endDate
  const { filter } = useAppSelector((state) => state.sickLeave)
  const dropdown = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (dropdown.current) {
      dropdown.current.addEventListener('click', (event) => {
        event.stopPropagation()
      })
    }
  })

  if (!populatedFilters) {
    return null
  }

  const handleSetRekoStatus = (event: MouseEvent, type: RekoStatusType) => {
    event.stopPropagation()
    setRekoStatus({ patientId, status: type, sickLeaveTimestamp, filter })
    updateSavedRekoStatus(type.name)
  }

  return (
    <SelectButton title={savedRekoStatus}>
      {populatedFilters.rekoStatusTypes.map((type) => (
        <button
          ref={dropdown}
          key={type.id}
          onClick={(event) => handleSetRekoStatus(event, type)}
          type="button"
          className="hover:bg-secondary-95 py-1 text-left">
          <span className="px-2">{type.name}</span>
        </button>
      ))}
    </SelectButton>
  )
}
