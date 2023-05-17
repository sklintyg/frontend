import { ReactNode } from 'react'
import { Table } from '../../../components/Table/Table'
import { PatientSjukfall } from '../../../schemas/patientSchema'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'
import { PatientAccordion } from './PatientAccordion'
import { PatientTableBody } from './PatientTableBody'
import { PatientTableHeader } from './PatientTableHeader'

export function PatientSickLeaves({
  sickLeaves,
  children,
  isDoctor,
}: {
  sickLeaves: PatientSjukfall[]
  children?: ReactNode
  isDoctor: boolean
}) {
  return (
    <>
      {sickLeaves.map(({ start, slut, diagnos, dagar, intyg }) => (
        <PatientAccordion key={`${start}${slut}`} diagnos={diagnos} dagar={dagar}>
          <Table sortColumn={PatientColumn.Num}>
            <PatientTableHeader isDoctor={isDoctor} />
            <PatientTableBody certificates={intyg} isDoctor={isDoctor} />
          </Table>
          {children}
        </PatientAccordion>
      ))}
    </>
  )
}
