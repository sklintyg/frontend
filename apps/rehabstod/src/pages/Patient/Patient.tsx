import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useParams } from 'react-router-dom'
import { useGetSickLeavePatientQuery, useGetUserQuery } from '../../store/api'
import { isDateBeforeToday } from '../../utils/isDateBeforeToday'
import { ModifyPatientTableColumns } from './components/ModifyPatientTableColumns'
import { PatientHeader } from './components/PatientHeader'
import { PatientSickLeaves } from './components/PatientSickLeaves'

export function Patient() {
  const { patientId } = useParams()
  const { data: user } = useGetUserQuery()
  const { data: patient } = useGetSickLeavePatientQuery(patientId ? { patientId: atob(patientId) } : skipToken)
  const sickLeaves = patient?.sjukfallList ?? []
  const currentSickLeaves = sickLeaves.filter(({ slut }) => !isDateBeforeToday(slut))
  const earlierSickLeaves = sickLeaves.filter(({ slut }) => isDateBeforeToday(slut))

  return (
    <>
      {patient && <PatientHeader patient={patient} />}
      <div className="ids-content m-auto max-w-7xl py-10 px-2.5">
        <div className="ml-auto w-96">
          <ModifyPatientTableColumns />
        </div>
        <h1 className="ids-heading-2">Pågående sjukfall på {user?.valdVardenhet?.namn}</h1>
        <PatientSickLeaves sickLeaves={currentSickLeaves} />

        <h2 className="ids-heading-2 text-neutral-20">Tidigare sjukfall på {user?.valdVardenhet?.namn}</h2>
        <PatientSickLeaves sickLeaves={earlierSickLeaves} />
      </div>
    </>
  )
}
