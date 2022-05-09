import * as React from 'react'
import PatientStatusNotification from '../../feature/certificate/Notifications/PatientStatusNotification'

interface Props {
  isPatientDeceased: boolean
}

const PatientDeceasedStatus: React.FC<Props> = ({ isPatientDeceased }) => {
  return <PatientStatusNotification type="info" title="Patienten är avliden" status={isPatientDeceased} />
}

export default PatientDeceasedStatus
