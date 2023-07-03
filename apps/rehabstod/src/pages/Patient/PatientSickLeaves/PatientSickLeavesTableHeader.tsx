import { TableHeaderCell } from '../../../components/Table/tableHeader/TableHeaderCell'
import { filterTableColumns } from '../../../components/Table/utils/filterTableColumns'
import { useGetSickLeavesFiltersQuery } from '../../../store/api'
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
      return <TableHeaderCell column={column} width="120px" />
    case PatientColumn.Slutdatum:
      return <TableHeaderCell column={column} width="120px" />
    case PatientColumn.Längd:
      return <TableHeaderCell column={column} width="90px" />
    case PatientColumn.Grad:
      return <TableHeaderCell column={column} width="100px" />
    case PatientColumn.Ärenden:
      return <TableHeaderCell column={column} width="170px" />
    case PatientColumn.Läkare:
      return <TableHeaderCell column={column} width="114px" />
    case PatientColumn.Sysselsättning:
      return <TableHeaderCell column={column} width="140px" />
    case PatientColumn.Vårdenhet:
      return <TableHeaderCell column={column} width="120px" />
    case PatientColumn.Vårdgivare:
      return <TableHeaderCell column={column} width="120px" />
    case PatientColumn.Risk:
      return <TableHeaderCell column={column} width="150px" />
    case PatientColumn.Intyg:
      return <TableHeaderCell column={column} width="80px" sticky="right" />
    default:
      return null
  }
}

export function PatientSickLeavesTableHeader({ isDoctor }: { isDoctor: boolean }) {
  const columns = useAppSelector(allPatientColumns)
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const visibleColumns = filterTableColumns(columns, isDoctor, undefined, true, populatedFilters && populatedFilters.srsActivated, [
    PatientColumn.Visa,
  ])

  return (
    <thead>
      {columns.length > 0 && (
        <tr>
          {visibleColumns.map(({ name }) => (
            <PatientTableHeaderResolver key={name} column={name} />
          ))}
        </tr>
      )}
    </thead>
  )
}
