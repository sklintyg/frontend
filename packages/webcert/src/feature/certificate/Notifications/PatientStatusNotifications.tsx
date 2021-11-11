import * as React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import {
  getIsPatientDeceased,
  getIsPatientIdUpdated,
  getIsPatientNameDifferentFromEHR,
  getIsPatientProtectedPerson,
  getIsPatientTestIndicated,
  getPatient,
  getPreviousPatientId,
} from '../../../store/certificate/certificateSelectors'
import styled from 'styled-components'
import PatientStatusNotification from './PatientStatusNotification'
import PatientStatusNotificationWithModal from './PatientStatusNotificationWithModal'
import { PersonId } from '@frontend/common/src'

const Wrapper = styled.div`
  padding-bottom: 10px;
  display: flex;
`

const PatientStatusNotifications: React.FC = () => {
  const isPatientDeceased = useSelector(getIsPatientDeceased)
  const isPatientProtectedPerson = useSelector(getIsPatientProtectedPerson)
  const isPatientTestIndicated = useSelector(getIsPatientTestIndicated)
  const isPatientNameDifferentFromEHR = useSelector(getIsPatientNameDifferentFromEHR)
  const previousPatientId: PersonId | undefined = useSelector(getPreviousPatientId, shallowEqual)
  const isPatientIdUpdated = useSelector(getIsPatientIdUpdated)
  const patient = useSelector(getPatient)

  const testPersonTitle = 'Patienten är en valideringsperson'
  const protectedPersonTitle = 'Patienten har skyddade personuppgifter'

  if (
    !isPatientDeceased &&
    !isPatientProtectedPerson &&
    !isPatientTestIndicated &&
    !isPatientNameDifferentFromEHR &&
    !previousPatientId &&
    !isPatientIdUpdated
  )
    return null

  return (
    <Wrapper>
      <PatientStatusNotification type={'info'} title={'Patienten är avliden'} status={isPatientDeceased} />
      <PatientStatusNotificationWithModal
        type={'info'}
        status={isPatientProtectedPerson}
        title={protectedPersonTitle}
        modalTitle={protectedPersonTitle}>
        <p>
          Att en patient har skyddade personuppgifter betyder att Skatteverket har bedömt att patientens personuppgifter är extra viktiga
          att skydda. Det finns speciella riktlinjer för hur personuppgifter för de invånarna ska hanteras. I Webcert innebär det att:
          <ul>
            <li>
              Du som användare av Webcert ska behandla personuppgifterna med försiktighet. Samtliga personuppgifter rörande patienten är
              skyddsvärda.
            </li>
            <li>
              Endast läkare och tandläkare kan skapa intyg för dessa patienter. Endast läkare och tandläkare, inloggade på den vårdenhet
              intyget utfärdades på, kan se och hantera intyget.
            </li>
            <li>En symbol visas i alla vyer i gränssnittet som indikerar att patienten har skyddade personuppgifter.</li>
            <li>
              Endast ett urval av intygstyper kan utfärdas för patienten med skyddade personuppgifter. Det beror på att det krävs särskild
              hantering av deras personuppgifter i Webcert och hos mottagaren av intyget.
            </li>
          </ul>
        </p>
      </PatientStatusNotificationWithModal>
      <PatientStatusNotification type={'info'} title={'Patientens personnummer har ändrats'} status={isPatientIdUpdated} />
      <PatientStatusNotificationWithModal
        type={'info'}
        status={isPatientTestIndicated}
        title={testPersonTitle}
        modalTitle={testPersonTitle}>
        <p>
          En valideringsperson är en fingerad person som används i syfte att validera funktion, felsöka och säkerställa kvalitet i tjänsten.
          Intyg utfärdade på valideringsperson kan inte skickas till intygsmottagare. De kommer inte heller visas i Intygsstatistik,
          Rehabstöd eller i Mina intyg.{' '}
        </p>
      </PatientStatusNotificationWithModal>
      <PatientStatusNotificationWithModal
        type={'observe'}
        status={(!isPatientIdUpdated && previousPatientId && previousPatientId.id !== '') as boolean}
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
