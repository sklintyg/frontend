import { ReactNode } from 'react'
import { usePatientSickLeavesTableColumns } from './hooks/usePatientSickLeavesTableColumns'
import { PatientTableBody } from './PatientTableBody'
import { Table } from '../../../../components/Table/Table'
import { TableHeader } from '../../../../components/Table/tableHeader/TableHeader'
import { PatientSjukfall } from '../../../../schemas/patientSchema'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { PatientDiagnosisAccordion } from '../PatientAccordion/PatientDiagnosisAccordion'

export function PatientSickLeavesTable({
  sickLeaves,
  children,
  isDoctor,
  title,
  open = true,
}: {
  sickLeaves: PatientSjukfall[]
  children?: ReactNode
  isDoctor: boolean
  title: string
  open?: boolean
}) {
  const columns = usePatientSickLeavesTableColumns()

  return (
    <>
      <h3 className="ids-heading-3">{title}</h3>
      {sickLeaves.map(({ start, slut, diagnos, dagar, intyg }) => (
        <PatientDiagnosisAccordion key={`${start}${slut}`} diagnos={diagnos} dagar={dagar} open={open}>
          <Table header={<TableHeader columns={columns} />} sortColumn={PatientColumn.Num}>
            <PatientTableBody certificates={intyg} isDoctor={isDoctor} />
          </Table>
          {children}
        </PatientDiagnosisAccordion>
      ))}
    </>
  )
}
