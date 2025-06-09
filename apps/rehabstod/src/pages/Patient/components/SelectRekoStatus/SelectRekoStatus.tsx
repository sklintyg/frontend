import { Select } from '../../../../components/form/Select/Select'
import type { RekoStatusType } from '../../../../schemas/sickLeaveSchema'
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
  const { data: rekoStatus } = useGetRekoStatusForPatientQuery({ patientId, endDate, startDate })
  const emptyRekoStatus = rekoStatusTypes.find((rekoStatusType) => rekoStatusType.name === '-')
  const sickLeaveTimestamp = getRekoStatusSickLeaveTimestamp(endDate)
  const { filter } = useAppSelector((state) => state.sickLeaveFilter)

  const handleSetRekoStatus = (id: string) => {
    const type = rekoStatusTypes.find((rekoStatusType) => id === rekoStatusType.id)
    if (type) {
      setRekoStatus({ patientId, status: type, sickLeaveTimestamp, filter })
    }
  }

  return (
    <Select
      disabled={disabled}
      value={rekoStatus?.status?.id || emptyRekoStatus?.id}
      onChange={(event) => handleSetRekoStatus(event.target.value)}
      options={rekoStatusTypes.map(({ id, name }) => ({ label: name, value: id }))}
      description={description}
      label="Status"
    />
  )
}
