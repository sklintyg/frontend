import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useParams } from 'react-router-dom'
import { IDSContainer } from '@frontend/ids-react-ts'
import { useGetSickLeavePatientQuery, useGetUserQuery } from '../../store/api'
import { PatientHeader } from './components/PatientHeader'

export function Patient() {
  const { patientId } = useParams()
  const { data: user } = useGetUserQuery()
  const { data: patient } = useGetSickLeavePatientQuery(patientId ? { patientId: atob(patientId) } : skipToken)

  return (
    <>
      {patient && <PatientHeader patient={patient} />}
      <IDSContainer>
        <div className="ids-content py-10">
          <h1 className="ids-heading-2">Pågående sjukfall på {user?.valdVardenhet?.namn}</h1>
        </div>
      </IDSContainer>
    </>
  )
}
