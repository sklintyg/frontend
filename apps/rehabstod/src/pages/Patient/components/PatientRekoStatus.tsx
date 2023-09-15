import { PatientSjukfall } from '../../../schemas/patientSchema'
import { useGetSickLeavesFiltersQuery } from '../../../store/sickLeaveApi'
import { SelectRekoStatus } from './SelectRekoStatus/SelectRekoStatus'

export function PatientRekoStatus({
  currentSickLeaves,
  earlierSickLeaves,
  isDoctor,
  patientId,
}: {
  currentSickLeaves: PatientSjukfall[]
  earlierSickLeaves: PatientSjukfall[]
  isDoctor: boolean
  patientId: string
}) {
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()

  const getLastCertificate = () => {
    if (currentSickLeaves && currentSickLeaves.length > 0) {
      return currentSickLeaves.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0]
    }

    if (earlierSickLeaves && earlierSickLeaves.length > 0) {
      return earlierSickLeaves.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0]
    }

    return null
  }

  const getFirstCertificate = () => {
    if (currentSickLeaves && currentSickLeaves.length > 0) {
      return currentSickLeaves.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0]
    }

    if (earlierSickLeaves && earlierSickLeaves.length > 0) {
      return earlierSickLeaves.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0]
    }

    return null
  }

  return (
    <div className="w-full lg:w-64">
      <SelectRekoStatus
        disabled={isDoctor}
        endDate={getLastCertificate()?.slut || ''}
        startDate={getFirstCertificate()?.start || ''}
        patientId={patientId}
        rekoStatusTypes={populatedFilters ? populatedFilters.rekoStatusTypes : []}
        description={
          isDoctor
            ? 'Med REKO-status kan du som läkare se patientens nuvarande status. Den visas även i sjukfallstabellen. Som läkare kan du se men inte ändra en status.'
            : 'Med REKO-status kan du som rehabkoordinator ange patientens nuvarande status. Dina ändringar visas även i sjukfallstabellen och kommer sparas tills vidare.'
        }
      />
    </div>
  )
}
