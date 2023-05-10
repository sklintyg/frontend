import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useParams } from 'react-router-dom'
import { PuResponse } from '../../schemas/patientSchema'
import { useGetSickLeavePatientQuery, useGetUserQuery } from '../../store/api'
import { isDateBeforeToday } from '../../utils/isDateBeforeToday'
import { ModifyPatientTableColumns } from './components/ModifyPatientTableColumns'
import { PatientHeader } from './components/PatientHeader'
import { PatientOverview } from './components/patientOverview/PatientOverview'
import { PatientSickLeaves } from './components/PatientSickLeaves'

export function Patient() {
  const { encryptedPatientId } = useParams()
  const { data: user } = useGetUserQuery()
  const { data: patient } = useGetSickLeavePatientQuery(
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

  return (
    <>
      {patient && <PatientHeader patient={patient} />}
      <div className="ids-content m-auto max-w-7xl py-10 px-2.5">
        <div className="ml-auto w-96">
          <ModifyPatientTableColumns />
        </div>
        {currentSickLeaves.length > 0 && (
          <>
            <h1 className="ids-heading-2">Pågående sjukfall på {user?.valdVardenhet?.namn}</h1>
            <PatientSickLeaves sickLeaves={currentSickLeaves} />
          </>
        )}
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
        {earlierSickLeaves.length > 0 && (
          <>
            <h2 className="ids-heading-2 text-neutral-20">Tidigare sjukfall på {user?.valdVardenhet?.namn}</h2>
            <PatientSickLeaves sickLeaves={earlierSickLeaves} />
          </>
        )}
      </div>
    </>
  )
}
