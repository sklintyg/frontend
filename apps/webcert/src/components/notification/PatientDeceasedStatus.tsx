import PatientStatusNotification from '../../feature/certificate/Notifications/PatientStatusNotification'

interface Props {
  isPatientDeceased: boolean
}

const PatientDeceasedStatus = ({ isPatientDeceased }: Props) => {
  return <PatientStatusNotification type="deceased" title="Patienten är avliden" status={isPatientDeceased} />
}

export default PatientDeceasedStatus
