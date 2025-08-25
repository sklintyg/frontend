import type { ReactNode } from 'react'
import { Heading } from '../../../../components/Heading/Heading'
import { Table } from '../../../../components/Table/Table'
import { TableHeader } from '../../../../components/Table/tableHeader/TableHeader'
import type { PatientSjukfall } from '../../../../schemas/patientSchema'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { PatientDiagnosisAccordion } from '../PatientAccordion/PatientDiagnosisAccordion'
import { PatientTableBody } from './PatientTableBody'
import { usePatientSickLeavesTableColumns } from './hooks/usePatientSickLeavesTableColumns'

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
      <Heading level={3} size="s">
        {title}
      </Heading>
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
