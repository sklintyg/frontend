import { ReactNode } from 'react'
import { Table } from '../../../components/Table/Table'
import { PatientSjukfall } from '../../../schemas/patientSchema'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'
import { PatientAccordion } from './PatientAccordion'
import { PatientTableBody } from './PatientTableBody'
import { PatientTableHeader } from './PatientTableHeader'

export function PatientSickLeaves({ sickLeaves, children }: { sickLeaves: PatientSjukfall[]; children?: ReactNode }) {
  return (
    <>
      {sickLeaves.map(({ start, slut, diagnos, dagar, intyg }) => (
        <PatientAccordion key={`${start}${slut}`} diagnos={diagnos} dagar={dagar}>
          <Table sortColumn={PatientColumn.Num}>
            <PatientTableHeader />
            <PatientTableBody certificates={intyg} />
          </Table>
          {children}
        </PatientAccordion>
      ))}
    </>
  )
}
