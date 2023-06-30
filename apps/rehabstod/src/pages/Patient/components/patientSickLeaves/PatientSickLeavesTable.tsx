import { ReactNode } from 'react'
import { Table } from '../../../../components/Table/Table'
import { PatientSjukfall } from '../../../../schemas/patientSchema'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { PatientDiagnosisAccordion } from '../../../../components/PatientAccordion/PatientDiagnosisAccordion'
import { PatientTableBody } from './PatientTableBody'
import { PatientTableHeader } from '../PatientTableHeader'
import { FixedTableHeader } from '../../../CurrentSickLeaves/components/FixedTableHeader'

export function PatientSickLeavesTable({
  sickLeaves,
  children,
  isDoctor,
  title,
}: {
  sickLeaves: PatientSjukfall[]
  children?: ReactNode
  isDoctor: boolean
  title: string
}) {
  return (
    <>
      <h2 className="ids-heading-3">{title}</h2>
      {sickLeaves.map(({ start, slut, diagnos, dagar, intyg }) => (
        <PatientDiagnosisAccordion key={`${start}${slut}`} diagnos={diagnos} dagar={dagar}>
          <Table sortColumn={PatientColumn.Num}>
            <FixedTableHeader bottomMargin={90} topMargin>
              <PatientTableHeader isDoctor={isDoctor} />
            </FixedTableHeader>
            <PatientTableBody certificates={intyg} isDoctor={isDoctor} />
          </Table>
          {children}
        </PatientDiagnosisAccordion>
      ))}
    </>
  )
}
