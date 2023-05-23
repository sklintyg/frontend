import { useState } from 'react'
import { format, isAfter } from 'date-fns'
import { useGetPopulatedFiltersQuery, useSetRekoStatusMutation } from '../../store/api'
import { RekoStatus } from '../../schemas/sickLeaveSchema'
import { SelectButton } from '../Form/SelectButton'

export function RekoStatusDropdown({ status, patientId, endDate }: { status: string; patientId: string; endDate: string }) {
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
  const [setRekoStatus] = useSetRekoStatusMutation()
  const [rekoStatus, updateRekoStatus] = useState(status)
  const sickLeaveTimestamp = isAfter(new Date(endDate), new Date()) ? format(new Date(), 'yyyy-MM-dd') : endDate

  if (!populatedFilters) {
    return null
  }

  const handleSetRekoStatus = (type: RekoStatus) => {
    setRekoStatus({ patientId, status: type.id, sickLeaveTimestamp })
    updateRekoStatus(type.name)
  }

  return (
    <SelectButton title={rekoStatus}>
      {populatedFilters.rekoStatusTypes.map((type) => (
        <button key={type.id} onClick={() => handleSetRekoStatus(type)} type="button" className="py-1 text-left">
          {type.name}
        </button>
      ))}
    </SelectButton>
  )
}
