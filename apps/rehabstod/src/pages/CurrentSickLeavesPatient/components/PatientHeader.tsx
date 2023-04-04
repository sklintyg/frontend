import { IDSIcon } from '@frontend/ids-react-ts'
import { useGetSickLeavePatientQuery } from '../../../store/api'

export function PatientHeader({ patientId }: { patientId: string }) {
  const { data: patient } = useGetSickLeavePatientQuery({ patientId })

  if (!patient) {
    return null
  }

  return (
    <div>
      <IDSIcon name="user" />
      <span>{patient.sjukfallList[0].intyg[0].patient.namn}</span>
    </div>
  )
}
