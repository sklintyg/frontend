import type { Patient } from '../../types'
import PatientDeceasedStatus from './PatientDeceasedStatus'
import PatientTestIndicatedStatus from './PatientTestIndicatedStatus'
import ProtectedPatientStatus from './ProtectedPatientStatus'

interface Props {
  patient: Patient
}

const PatientStatuses: React.FC<Props> = ({ patient }) => {
  return (
    <div className="iu-flex iu-pt-300">
      <PatientDeceasedStatus isPatientDeceased={patient.deceased} />
      <ProtectedPatientStatus isProtectedPatient={patient.protectedPerson} />
      <PatientTestIndicatedStatus isTestIndicated={patient.testIndicated} />
    </div>
  )
}

export default PatientStatuses
