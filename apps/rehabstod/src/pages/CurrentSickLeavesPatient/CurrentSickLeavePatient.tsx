import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useParams } from 'react-router-dom'
import { useGetSickLeavePatientQuery, useGetSickLeavesQuery, useGetUserQuery } from '../../store/api'
import { PatientHeader } from './components/PatientHeader'

export function CurrentSickLeavesPatient() {
  const { patientId } = useParams()
  const { data: user } = useGetUserQuery()
  const { data: patient } = useGetSickLeavePatientQuery(patientId ? { patientId } : skipToken)
  useGetSickLeavesQuery()

  return (
    <>
      {patient && <PatientHeader patient={patient} />}
      <div className="ids-content py-10">
        <h1 className="ids-heading-2">Pågående sjukfall på {user?.valdVardenhet?.namn}</h1>
      </div>
    </>
  )
}
