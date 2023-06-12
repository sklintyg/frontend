import { skipToken } from '@reduxjs/toolkit/query'
import { useParams } from 'react-router-dom'
import { DisplayError } from '../../components/error/DisplayError/DisplayError'
import { UserUrval } from '../../schemas'
import { PuResponse } from '../../schemas/patientSchema'
import { useGetSickLeavePatientQuery, useGetUserQuery } from '../../store/api'
import { isDateBeforeToday } from '../../utils/isDateBeforeToday'
import { ModifyPatientTableColumns } from './components/ModifyPatientTableColumns'
import { OpenTabsDialog } from './components/OpenTabsDialog'
import { PatientErrorHeader } from './components/PatientErrorHeader'
import { PatientHeader } from './components/PatientHeader'
import { PatientSickLeaves } from './components/PatientSickLeaves'
import { PatientOverview } from './components/patientOverview/PatientOverview'
import { PatientContext, usePatientState } from './hooks/usePatient'

export function Patient() {
  const patientState = usePatientState()
  const { encryptedPatientId } = useParams()
  const { data: user } = useGetUserQuery()
  const { data: patient, error } = useGetSickLeavePatientQuery(
    encryptedPatientId
      ? {
          encryptedPatientId,
        }
      : skipToken
  )
  const sickLeaves = patient?.sjukfallList ?? []
  const currentSickLeaves = sickLeaves.filter(({ slut }) => !isDateBeforeToday(slut))
  const earlierSickLeaves = sickLeaves.filter(({ slut }) => isDateBeforeToday(slut))
  const currentSickness = patient?.sjukfallList.find(({ slut }) => !isDateBeforeToday(slut))
  const firstCertificate = currentSickness ? currentSickness.intyg[0] : null
  const isDoctor = user?.urval === UserUrval.ISSUED_BY_ME

  return (
    <PatientContext.Provider value={patientState}>
      {patient ? <PatientHeader patient={patient} /> : <PatientErrorHeader />}
      <OpenTabsDialog />
      <div className="ids-content m-auto max-w-7xl py-10 px-2.5">
        <div className="ml-auto w-96">{!error && <ModifyPatientTableColumns />}</div>
        {error && (
          <DisplayError
            heading="Tekniskt fel"
            errorType="error"
            text="Information kan inte visas på grund av ett tekniskt fel. Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand"
            dynamicLink
          />
        )}
        {currentSickLeaves.length > 0 && (
          <>
            <h1 className="ids-heading-2">Pågående sjukfall på {user?.valdVardenhet?.namn}</h1>
            <PatientSickLeaves sickLeaves={currentSickLeaves} isDoctor={isDoctor}>
              <PatientOverview
                sjfMetaData={patient?.sjfMetaData}
                patientId={firstCertificate ? firstCertificate.patient.id : ''}
                isPersonResponseMissing={
                  firstCertificate
                    ? firstCertificate.patient.responseFromPu === PuResponse.NOT_FOUND ||
                      firstCertificate.patient.responseFromPu === PuResponse.FOUND_NO_NAME
                    : false
                }
                encryptedPatientId={encryptedPatientId || ''}
              />
            </PatientSickLeaves>
          </>
        )}
        {earlierSickLeaves.length > 0 && (
          <>
            <h2 className="ids-heading-2 text-neutral-20">Tidigare sjukfall på {user?.valdVardenhet?.namn}</h2>
            <PatientSickLeaves sickLeaves={earlierSickLeaves} isDoctor={isDoctor} />
          </>
        )}
      </div>
    </PatientContext.Provider>
  )
}
