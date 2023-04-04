import { IDSIcon } from '@frontend/ids-react-ts'
import { Patient } from '../../../schemas/patientSchema'

export function PatientHeader({ patient }: { patient: Patient }) {
  return (
    <div>
      <IDSIcon name="user" />
      <span>{patient.sjukfallList[0].intyg[0].patient.namn}</span>
    </div>
  )
}
