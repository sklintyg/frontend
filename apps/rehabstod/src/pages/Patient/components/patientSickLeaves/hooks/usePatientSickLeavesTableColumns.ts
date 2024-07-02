import type { Column } from '../../../../../components/Table/types/Column'
import { filterTableColumns } from '../../../../../components/Table/utils/filterTableColumns'
import { UserUrval } from '../../../../../schemas'
import { useGetUserQuery } from '../../../../../store/api'
import { useAppSelector } from '../../../../../store/hooks'
import { useGetSickLeavesFiltersQuery } from '../../../../../store/sickLeaveApi'
import { allPatientColumns } from '../../../../../store/slices/patientTableColumns.selector'
import { PatientColumn } from '../../../../../store/slices/patientTableColumns.slice'

const getPatientSickLeaveColumnWidth = (column: string): number | undefined => {
  switch (column) {
    case PatientColumn.Num:
      return 62
    case PatientColumn.Diagnos:
      return 255
    case PatientColumn.Startdatum:
    case PatientColumn.Slutdatum:
    case PatientColumn.Vårdenhet:
    case PatientColumn.Vårdgivare:
      return 120
    case PatientColumn.Längd:
      return 90
    case PatientColumn.Grad:
      return 100
    case PatientColumn.Ärenden:
      return 170
    case PatientColumn.Läkare:
      return 114
    case PatientColumn.Sysselsättning:
      return 140
    case PatientColumn.Risk:
      return 150
    case PatientColumn.Intyg:
      return 80
    default:
      return undefined
  }
}

export function usePatientSickLeavesTableColumns(): Column[] {
  const { data: user } = useGetUserQuery()
  const columns = useAppSelector(allPatientColumns)
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const isDoctor = user?.urval === UserUrval.ISSUED_BY_ME
  const visibleColumns = filterTableColumns(columns, isDoctor, undefined, true, populatedFilters && populatedFilters.srsActivated, [
    PatientColumn.Intygstyp,
  ])

  return visibleColumns.map(({ name }) => ({
    name,
    width: getPatientSickLeaveColumnWidth(name),
    sticky: name === PatientColumn.Intyg ? 'right' : undefined,
    sortable: name !== PatientColumn.Num,
  }))
}
