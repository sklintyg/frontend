/* eslint-disable react/jsx-props-no-spreading */
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useParams } from 'react-router-dom'
import { Table } from '../../components/Table/Table'
import { SickLeaveColumn } from '../../schemas/sickLeaveSchema'
import { useGetSickLeavePatientQuery, useGetUserQuery } from '../../store/api'
import { PatientAccordion } from './components/PatientAccordion'
import { PatientHeader } from './components/PatientHeader'
import { PatientTableBody } from './components/PatientTableBody'
import { PatientTableHeader } from './components/PatientTableHeader'

export function Patient() {
  const { patientId } = useParams()
  const { data: user } = useGetUserQuery()
  const { data: patient } = useGetSickLeavePatientQuery(patientId ? { patientId: atob(patientId) } : skipToken)
  const sickLeaves = patient?.sjukfallList ?? []
  const currentSickLeave = sickLeaves[0]
  const earlierSickLeaves = sickLeaves.slice(1)

  return (
    <>
      {patient && <PatientHeader patient={patient} />}
      <div className="ids-content py-10">
        <h1 className="ids-heading-2">Pågående sjukfall på {user?.valdVardenhet?.namn}</h1>
        {currentSickLeave && (
          <PatientAccordion diagnos={currentSickLeave.diagnos} dagar={currentSickLeave.dagar}>
            <Table column={SickLeaveColumn.Num}>
              <PatientTableHeader />
              <PatientTableBody certificates={currentSickLeave.intyg} />
            </Table>
          </PatientAccordion>
        )}
        <h2 className="ids-heading-2 text-neutral-20">Tidigare sjukfall på {user?.valdVardenhet?.namn}</h2>
        {earlierSickLeaves.map(({ start, slut, diagnos, dagar, intyg }) => (
          <PatientAccordion key={`${start}${slut}`} diagnos={diagnos} dagar={dagar}>
            <Table column={SickLeaveColumn.Num}>
              <PatientTableHeader />
              <PatientTableBody certificates={intyg} />
            </Table>
          </PatientAccordion>
        ))}
      </div>
    </>
  )
}
