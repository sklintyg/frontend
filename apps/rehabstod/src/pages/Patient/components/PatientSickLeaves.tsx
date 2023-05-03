import { Table } from '../../../components/Table/Table'
import { PatientSjukfall } from '../../../schemas/patientSchema'
import { SickLeaveColumn } from '../../../schemas/sickLeaveSchema'
import { PatientAccordion } from './PatientAccordion'
import { PatientTableBody } from './PatientTableBody'
import { PatientTableHeader } from './PatientTableHeader'

export function PatientSickLeaves({ sickLeaves }: { sickLeaves: PatientSjukfall[] }) {
  return (
    <>
      {sickLeaves.map(({ start, slut, diagnos, dagar, intyg }) => (
        <PatientAccordion key={`${start}${slut}`} diagnos={diagnos} dagar={dagar}>
          <Table column={SickLeaveColumn.Num}>
            <PatientTableHeader />
            <PatientTableBody certificates={intyg} />
          </Table>
        </PatientAccordion>
      ))}
    </>
  )
}
