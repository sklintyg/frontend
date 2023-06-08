import * as React from 'react'
import PatientDeceasedStatus from './PatientDeceasedStatus'
import { Patient } from '@frontend/common'
import ProtectedPatientStatus from './ProtectedPatientStatus'
import PatientTestIndicatedStatus from './PatientTestIndicatedStatus'

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
