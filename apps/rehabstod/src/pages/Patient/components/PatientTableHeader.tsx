import { TableHeaderCell } from '../../../components/Table/TableHeaderCell'
import { useAppSelector } from '../../../store/hooks'
import { PatientColumn } from '../../../store/slices/patientTableColumnsSlice'

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
      return <TableHeaderCell column={column} width="96px" />
    default:
      return null
  }
}

export function PatientTableHeader() {
  const columns = useAppSelector((state) => state.patientTableColumns)
  return (
    <thead>
      <tr>
        {columns
          .filter(({ enabled }) => enabled)
          .map(({ name }) => (
            <PatientTableHeaderResolver key={name} column={name} />
          ))}
      </tr>
    </thead>
  )
}
