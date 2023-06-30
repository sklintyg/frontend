import { useLocation } from 'react-router-dom'
import { SelectRekoStatus } from '../../../components/SelectRekoStatus/SelectRekoStatus'
import { PatientSjukfall } from '../../../schemas/patientSchema'
import { useGetSickLeavesFiltersQuery } from '../../../store/api'

export function PatientRekoStatus({
  currentSickLeaves,
  earlierSickLeaves,
  isDoctor,
}: {
  currentSickLeaves: PatientSjukfall[]
  earlierSickLeaves: PatientSjukfall[]
  isDoctor: boolean
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
          disabled={isDoctor}
          endDate={certificateToSaveRekoStatusOn.slut}
          patientId={certificateToSaveRekoStatusOn.patient.id}
          statusFromSickLeave={state?.rekoStatus}
          rekoStatusTypes={populatedFilters ? populatedFilters.rekoStatusTypes : []}
          description={
            isDoctor
              ? 'Med REKO-status kan du som läkare se patientens nuvarande status. Den visas även i sjukfallstabellen. Som läkare kan du se men inte ändra en status.'
              : 'Med REKO-status kan du som rehabkoordinator ange patientens nuvarande status. Dina ändringar visas även i sjukfallstabellen och kommer sparas tills vidare.'
          }
        />
      </div>
    )
  )
}
