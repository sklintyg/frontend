import PatientStatusNotificationWithModal from '../../feature/certificate/Notifications/PatientStatusNotificationWithModal'

interface Props {
  isTestIndicated: boolean
}

const testPersonTitle = 'Patienten är en valideringsperson'

const PatientTestIndicatedStatus: React.FC<Props> = ({ isTestIndicated }) => {
  return (
    <PatientStatusNotificationWithModal type={'info'} status={isTestIndicated} title={testPersonTitle} modalTitle={testPersonTitle}>
      <p>
        En valideringsperson är en fingerad person som används i syfte att validera funktion, felsöka och säkerställa kvalitet i tjänsten.
        Intyg utfärdade på valideringsperson kan inte skickas till intygsmottagare. De kommer inte heller visas i Intygsstatistik, Rehabstöd
        eller i Mina intyg.{' '}
      </p>
    </PatientStatusNotificationWithModal>
  )
}

export default PatientTestIndicatedStatus
