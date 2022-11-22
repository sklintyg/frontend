import * as React from 'react'
import PatientStatusNotificationWithModal from '../../feature/certificate/Notifications/PatientStatusNotificationWithModal'

interface Props {
  isProtectedPatient: boolean
}

const protectedPersonTitle = 'Patienten har skyddade personuppgifter'

const ProtectedPatientStatus: React.FC<Props> = ({ isProtectedPatient }) => {
  return (
    <PatientStatusNotificationWithModal
      type="protected_person"
      status={isProtectedPatient}
      title={protectedPersonTitle}
      modalTitle={protectedPersonTitle}>
      <p>
        Att en patient har skyddade personuppgifter betyder att Skatteverket har bedömt att patientens personuppgifter är extra viktiga att
        skydda. Det finns speciella riktlinjer för hur personuppgifter för de invånarna ska hanteras. I Webcert innebär det att:
      </p>
      <p>
        <ul>
          <li>
            Du som användare av Webcert ska behandla personuppgifterna med försiktighet. Samtliga personuppgifter rörande patienten är
            skyddsvärda.
          </li>
          <li>Endast läkare och tandläkare kan skapa intyg för dessa patienter.</li>
          <li>Endast läkare och tandläkare, inloggade på den vårdenhet intyget utfärdades på, kan se och hantera intyget.</li>
          <li>En symbol visas i alla vyer i gränssnittet som indikerar att patienten har skyddade personuppgifter.</li>
          <li>
            Endast ett urval av intygstyper kan utfärdas för patienten med skyddade personuppgifter. Det beror på att det krävs särskild
            hantering av deras personuppgifter i Webcert och hos mottagaren av intyget.
          </li>
        </ul>
      </p>
    </PatientStatusNotificationWithModal>
  )
}

export default ProtectedPatientStatus
