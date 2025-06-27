import { shallowEqual } from 'react-redux'
import styled from 'styled-components'
import PatientDeceasedStatus from '../../../components/notification/PatientDeceasedStatus'
import PatientTestIndicatedStatus from '../../../components/notification/PatientTestIndicatedStatus'
import ProtectedPatientStatus from '../../../components/notification/ProtectedPatientStatus'
import {
  getIsPatientDeceased,
  getIsPatientIdChanged,
  getIsPatientNameDifferentFromEHR,
  getIsPatientProtectedPerson,
  getIsPatientTestIndicated,
  getIsReserveId,
  getPatient,
  getPreviousPatientId,
} from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'
import type { PersonId } from '../../../types'
import PatientStatusNotification from './PatientStatusNotification'
import PatientStatusNotificationWithModal from './PatientStatusNotificationWithModal'

const Wrapper = styled.div`
  display: flex;

  > * {
    margin-bottom: 10px;
  }
`

const PatientStatusNotifications = () => {
  const isPatientDeceased = useAppSelector(getIsPatientDeceased)
  const isPatientProtectedPerson = useAppSelector(getIsPatientProtectedPerson)
  const isPatientTestIndicated = useAppSelector(getIsPatientTestIndicated)
  const isPatientNameDifferentFromEHR = useAppSelector(getIsPatientNameDifferentFromEHR)
  const previousPatientId: PersonId | undefined = useAppSelector(getPreviousPatientId, shallowEqual)
  const isPatientIdChanged = useAppSelector(getIsPatientIdChanged)
  const isReserveId = useAppSelector(getIsReserveId)
  const patient = useAppSelector(getPatient)

  return (
    <Wrapper>
      <PatientDeceasedStatus isPatientDeceased={isPatientDeceased} />
      <ProtectedPatientStatus isProtectedPatient={isPatientProtectedPerson} />
      <PatientStatusNotification type={'info'} title={'Patientens personnummer har ändrats'} status={isPatientIdChanged} />
      <PatientTestIndicatedStatus isTestIndicated={isPatientTestIndicated} />
      <PatientStatusNotificationWithModal
        type={'info'}
        status={isReserveId}
        title={'Patienten har samordningsnummer kopplat till reservnummer: ' + (patient && previousPatientId ? patient.personId.id : '')}
        modalTitle={'Patientens samordningsnummer'}
      >
        <p>Om ett intyg skapas utifrån detta intyg kommer det nya intyget skrivas på samordningsnumret.</p>
      </PatientStatusNotificationWithModal>
      <PatientStatusNotificationWithModal
        type={'observe'}
        status={isPatientNameDifferentFromEHR}
        title={'Patientens namn skiljer sig från det i journalsystemet'}
        modalTitle={'Patientens namn skiljer sig'}
      >
        <p>
          Patientens namn som visas i intyget har hämtats från Personuppgiftstjänsten och skiljer sig från det som är lagrat i
          journalsystemet.{' '}
        </p>
      </PatientStatusNotificationWithModal>
    </Wrapper>
  )
}

export default PatientStatusNotifications
