import * as React from 'react'
import { useSelector } from 'react-redux'
import {
  getIsPatientDeceased,
  getIsPatientIdUpdated,
  getIsPatientNameDifferentFromEHR,
  getIsPatientProtectedPerson,
  getIsPatientTestIndicated,
  getPreviousPatientId,
} from '../../../store/certificate/certificateSelectors'
import styled from 'styled-components'
import PatientStatusNotification from './PatientStatusNotification'
import PatientStatusNotificationWithModal from './PatientStatusNotificationWithModal'
import { PersonId } from '@frontend/common/src'

const Wrapper = styled.div`
  width: fit-content;
  padding-bottom: 10px;
`

const PatientStatusNotifications: React.FC = () => {
  const isPatientDeceased = useSelector(getIsPatientDeceased)
  const isPatientProtectedPerson = useSelector(getIsPatientProtectedPerson)
  const isPatientTestIndicated = useSelector(getIsPatientTestIndicated)
  const isPatientNameDifferentFromEHR = useSelector(getIsPatientNameDifferentFromEHR)
  const previousPatientId: PersonId = useSelector(getPreviousPatientId)
  const isPatientIdUpdated = useSelector(getIsPatientIdUpdated)

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
      <PatientStatusNotification title={'Patienten är avliden'} status={isPatientDeceased} />
      <PatientStatusNotificationWithModal status={isPatientProtectedPerson} title={protectedPersonTitle} modalTitle={protectedPersonTitle}>
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
      <PatientStatusNotificationWithModal
        status={isPatientNameDifferentFromEHR}
        title={'Patientens namn skiljer sig från det i journalsystemet'}
        modalTitle={'Patientens namn skiljer sig'}>
        <p>
          Patientens namn som visas i intyget har hämtats från Personuppgiftstjänsten och skiljer sig från det som är lagrat i
          journalsystemet.
        </p>
      </PatientStatusNotificationWithModal>
      <PatientStatusNotification title={'Patientens personnummer har ändrats'} status={isPatientIdUpdated} />
      <PatientStatusNotificationWithModal status={isPatientTestIndicated} title={testPersonTitle} modalTitle={testPersonTitle}>
        <p>
          En valideringsperson är en fingerad person som används i syfte att validera funktion, felsöka och säkerställa kvalitet i tjänsten.
          Intyg utfärdade på valideringsperson kan inte skickas till intygsmottagare. De kommer inte heller visas i Intygsstatistik,
          Rehabstöd eller i Mina intyg.
        </p>
      </PatientStatusNotificationWithModal>
      <PatientStatusNotificationWithModal
        status={!isPatientIdUpdated && previousPatientId && previousPatientId.id !== ''}
        title={'Patienten har samordningsnummer kopplat till reservnummer: ' + (previousPatientId ? previousPatientId.id : '')}
        modalTitle={'Patientens samordningsnummer'}>
        <p>Om ett intyg skapas utifrån detta intyg kommer det nya intyget skrivas på samordningsnumret.</p>
      </PatientStatusNotificationWithModal>
    </Wrapper>
  )
}

export default PatientStatusNotifications
