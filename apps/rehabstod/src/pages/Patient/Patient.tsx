import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useGetSickLeavePatientQuery, useGetSickLeavesQuery, useGetUserQuery } from '../../store/api'
import { RootState } from '../../store/store'
import { PatientHeader } from './components/PatientHeader'

export function Patient() {
  const { patientId } = useParams()
  const { data: user } = useGetUserQuery()
  const { data: patient } = useGetSickLeavePatientQuery(patientId ? { patientId: atob(patientId) } : skipToken)
  const { filter } = useSelector((state: RootState) => state.sickLeave)
  useGetSickLeavesQuery(filter ?? skipToken)

  return (
    <>
      {patient && <PatientHeader patient={patient} />}
      <div className="ids-content py-10">
        <h1 className="ids-heading-2">Pågående sjukfall på {user?.valdVardenhet?.namn}</h1>
      </div>
    </>
  )
}
