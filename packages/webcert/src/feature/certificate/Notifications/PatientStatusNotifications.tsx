import * as React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
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
import styled from 'styled-components'
import PatientStatusNotification from './PatientStatusNotification'
import PatientStatusNotificationWithModal from './PatientStatusNotificationWithModal'
import { PersonId } from '@frontend/common/src'
import PatientDeceasedStatus from '../../../components/notification/PatientDeceasedStatus'
import ProtectedPatientStatus from '../../../components/notification/ProtectedPatientStatus'
import PatientTestIndicatedStatus from '../../../components/notification/PatientTestIndicatedStatus'

const Wrapper = styled.div`
  display: flex;

  > * {
    margin-bottom: 10px;
  }
`

const PatientStatusNotifications: React.FC = () => {
  const isPatientDeceased = useSelector(getIsPatientDeceased)
  const isPatientProtectedPerson = useSelector(getIsPatientProtectedPerson)
  const isPatientTestIndicated = useSelector(getIsPatientTestIndicated)
  const isPatientNameDifferentFromEHR = useSelector(getIsPatientNameDifferentFromEHR)
  const previousPatientId: PersonId | undefined = useSelector(getPreviousPatientId, shallowEqual)
  const isPatientIdChanged = useSelector(getIsPatientIdChanged)
  const isReserveId = useSelector(getIsReserveId)
  const patient = useSelector(getPatient)

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
        modalTitle={'Patientens samordningsnummer'}>
        <p>Om ett intyg skapas utifrån detta intyg kommer det nya intyget skrivas på samordningsnumret.</p>
      </PatientStatusNotificationWithModal>
      <PatientStatusNotificationWithModal
        type={'observe'}
        status={isPatientNameDifferentFromEHR}
        title={'Patientens namn skiljer sig från det i journalsystemet'}
        modalTitle={'Patientens namn skiljer sig'}>
        <p>
          Patientens namn som visas i intyget har hämtats från Personuppgiftstjänsten och skiljer sig från det som är lagrat i
          journalsystemet.{' '}
        </p>
      </PatientStatusNotificationWithModal>
    </Wrapper>
  )
}

export default PatientStatusNotifications
