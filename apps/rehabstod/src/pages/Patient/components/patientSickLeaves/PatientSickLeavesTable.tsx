import { ReactNode } from 'react'
import { PatientDiagnosisAccordion } from '../../../../components/PatientAccordion/PatientDiagnosisAccordion'
import { Table } from '../../../../components/Table/Table'
import { TableHeader } from '../../../../components/Table/tableHeader/TableHeader'
import { PatientSjukfall } from '../../../../schemas/patientSchema'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { PatientTableBody } from './PatientTableBody'
import { usePatientSickLeavesTableColumns } from './hooks/usePatientSickLeavesTableColumns'

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
  const columns = usePatientSickLeavesTableColumns()

  return (
    <>
      <h2 className="ids-heading-3">{title}</h2>
      {sickLeaves.map(({ start, slut, diagnos, dagar, intyg }) => (
        <PatientDiagnosisAccordion key={`${start}${slut}`} diagnos={diagnos} dagar={dagar}>
          <Table header={<TableHeader columns={columns} />} sortColumn={PatientColumn.Num}>
            <PatientTableBody certificates={intyg} isDoctor={isDoctor} />
          </Table>
          {children}
        </PatientDiagnosisAccordion>
      ))}
    </>
  )
}
