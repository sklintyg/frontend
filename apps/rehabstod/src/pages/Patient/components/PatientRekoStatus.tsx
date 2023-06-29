import { useLocation } from 'react-router-dom'
import { SelectRekoStatus } from '../../../components/SelectRekoStatus/SelectRekoStatus'
import { PatientSjukfall } from '../../../schemas/patientSchema'
import { useGetSickLeavesFiltersQuery } from '../../../store/api'

export function PatientRekoStatus({
  currentSickLeaves,
  earlierSickLeaves,
}: {
  currentSickLeaves: PatientSjukfall[]
  earlierSickLeaves: PatientSjukfall[]
}) {
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const { state } = useLocation()
  const getCertificateToSaveRekoStatusOn = () => {
    if (currentSickLeaves && currentSickLeaves.length > 0) {
      return currentSickLeaves[0].intyg[0]
    }

    if (earlierSickLeaves && earlierSickLeaves.length > 0) {
      return earlierSickLeaves[0].intyg[0]
    }

    return null
  }

  const certificateToSaveRekoStatusOn = getCertificateToSaveRekoStatusOn()

  return (
    certificateToSaveRekoStatusOn && (
      <div className="w-64">
        <SelectRekoStatus
          endDate={certificateToSaveRekoStatusOn.slut}
          patientId={certificateToSaveRekoStatusOn.patient.id}
          statusFromSickLeave={state.rekoStatus}
          rekoStatusTypes={populatedFilters ? populatedFilters.rekoStatusTypes : []}
        />
      </div>
    )
  )
}
