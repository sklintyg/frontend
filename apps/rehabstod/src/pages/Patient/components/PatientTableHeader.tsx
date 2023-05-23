import { TableHeaderCell } from '../../../components/Table/TableHeaderCell'
import { useAppSelector } from '../../../store/hooks'
import { allPatientColumns } from '../../../store/slices/patientTableColumns.selector'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'

function PatientTableHeaderResolver({ column }: { column: string }) {
  switch (column) {
    case PatientColumn.Num:
      return <TableHeaderCell column={column} width="62px" />
    case PatientColumn.Diagnos:
      return <TableHeaderCell column={column} width="255px" />
    case PatientColumn.Startdatum:
      return <TableHeaderCell column={column} width="120px" />
    case PatientColumn.Slutdatum:
      return <TableHeaderCell column={column} width="120px" />
    case PatientColumn.Längd:
      return <TableHeaderCell column={column} width="90px" />
    case PatientColumn.Grad:
      return <TableHeaderCell column={column} width="100px" />
    case PatientColumn.Ärenden:
      return <TableHeaderCell column={column} width="80px" />
    case PatientColumn.Läkare:
      return <TableHeaderCell column={column} width="114px" />
    case PatientColumn.Sysselsättning:
      return <TableHeaderCell column={column} width="120px" />
    case PatientColumn.Intyg:
      return <TableHeaderCell column={column} width="80px" sticky="right" />
    default:
      return null
  }
}

export function PatientTableHeader({ isDoctor }: { isDoctor: boolean }) {
  const columns = useAppSelector(allPatientColumns)
  return (
    <thead>
      {columns.length > 0 && (
        <tr>
          {columns
            .filter(({ visible: checked }) => checked)
            .filter(({ name }) => !(isDoctor && name === SickLeaveColumn.Läkare))
            .map(({ name }) => (
              <PatientTableHeaderResolver key={name} column={name} />
            ))}
        </tr>
      )}
    </thead>
  )
}
