import { TableHeaderCell } from '../../../components/Table/TableHeaderCell'
import { useAppSelector } from '../../../store/hooks'
import { allPatientColumns } from '../../../store/slices/patientTableColumns.selector'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'

function PatientTableHeaderResolver({ column }: { column: string }) {
  switch (column) {
    case PatientColumn.Num:
      return <TableHeaderCell column={column} width="62px" />
    case PatientColumn.Diagnos:
      return <TableHeaderCell column={column} width="255px" />
    case PatientColumn.Startdatum:
      return <TableHeaderCell column={column} width="146px" />
    case PatientColumn.Slutdatum:
      return <TableHeaderCell column={column} width="146px" />
    case PatientColumn.Längd:
      return <TableHeaderCell column={column} width="96px" />
    case PatientColumn.Grad:
      return <TableHeaderCell column={column} width="102px" />
    case PatientColumn.Ärenden:
      return <TableHeaderCell column={column} width="142px" />
    case PatientColumn.Läkare:
      return <TableHeaderCell column={column} width="114px" />
    case PatientColumn.Sysselsättning:
      return <TableHeaderCell column={column} width="169px" />
    case PatientColumn.Intyg:
      return <TableHeaderCell column={column} width="96px" sticky="right" />
    default:
      return null
  }
}

export function PatientTableHeader() {
  const columns = useAppSelector(allPatientColumns)
  return (
    <thead>
      {columns.length > 0 && (
        <tr>
          {columns
            .filter(({ visible: checked }) => checked)
            .map(({ name }) => (
              <PatientTableHeaderResolver key={name} column={name} />
            ))}
        </tr>
      )}
    </thead>
  )
}
