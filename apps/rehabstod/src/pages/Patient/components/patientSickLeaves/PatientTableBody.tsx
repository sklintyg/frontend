import { useTableContext } from '../../../../components/Table/hooks/useTableContext'
import { TableRow } from '../../../../components/Table/tableBody/TableRow'
import { filterTableColumns } from '../../../../components/Table/utils/filterTableColumns'
import type { PatientSjukfallIntyg } from '../../../../schemas/patientSchema'
import { useAppSelector } from '../../../../store/hooks'
import { useGetSickLeavesFiltersQuery } from '../../../../store/sickLeaveApi'
import { allPatientColumns } from '../../../../store/slices/patientTableColumns.selector'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { getCertificateColumnData } from '../../utils/getCertificateColumnData'
import { PatientTableCellResolver } from './PatientTableCellResolver'

export function PatientTableBody({ certificates, isDoctor }: { certificates: PatientSjukfallIntyg[]; isDoctor: boolean }) {
  const { sortTableList } = useTableContext()
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const columns = useAppSelector(allPatientColumns)
  const visibleColumns = filterTableColumns(columns, isDoctor, undefined, true, populatedFilters && populatedFilters.srsActivated, [
    PatientColumn.Intygstyp,
  ])

  const sortedList = sortTableList(certificates, getCertificateColumnData)

  return (
    <tbody className="whitespace-normal break-words">
      {sortedList.map(
        (certificate) =>
          columns.length > 0 && (
            <TableRow key={`${certificate.intygsId}`} italic={certificate.otherVardgivare || certificate.otherVardenhet}>
              {visibleColumns.map(({ name }) => (
                <PatientTableCellResolver key={name} column={name} certificate={certificate} list={sortedList} />
              ))}
            </TableRow>
          )
      )}
    </tbody>
  )
}
