import { IDSSpinner } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { MaxColspanRow } from '../../../components/Table/tableBody/MaxColspanRow'
import { TableRow } from '../../../components/Table/tableBody/TableRow'
import { getEmptyFiltrationText, getEmptyTableText, getSearchText } from '../../../components/Table/utils/tableTextGeneratorUtils'
import { User } from '../../../schemas'
import { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { useAppSelector } from '../../../store/hooks'
import { useGetSickLeavesFiltersQuery } from '../../../store/sickLeaveApi'
import { allSickLeaveColumns } from '../../../store/slices/sickLeaveTableColumns.selector'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'
import { ResolveSickLeavesTableCell } from './ResolveSickLeavesTableCell'

export function TableBodyRows({
  isLoading,
  sickLeaves,
  showPersonalInformation,
  user,
  isDoctor,
}: {
  isLoading: boolean
  showPersonalInformation: boolean
  sickLeaves?: SickLeaveInfo[]
  user?: User
  isDoctor: boolean
}) {
  const navigate = useNavigate()
  const { sortTableList } = useTableContext()
  const columns = useAppSelector(allSickLeaveColumns)
  const { hasAppliedFilters } = useAppSelector((state) => state.sickLeave)
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()

  const TABLE_NAME = 'pågående sjukfall'
  const EMPTY_TEXT = getEmptyTableText(user, TABLE_NAME)
  const SEARCH_TEXT = getSearchText(isDoctor, TABLE_NAME)
  const EMPTY_TEXT_FILTRATION = getEmptyFiltrationText(TABLE_NAME)

  const visibleColumns = columns
    .filter(({ visible }) => visible)
    .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Personnummer))
    .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Namn))
    .filter(({ name }) => !(isDoctor && name === SickLeaveColumn.Läkare))
    .filter(({ name }) => !(!populatedFilters?.srsActivated && name === SickLeaveColumn.Risk))

  if (isLoading) {
    return (
      <MaxColspanRow colspan={visibleColumns.length}>
        <IDSSpinner />
      </MaxColspanRow>
    )
  }

  if (sickLeaves == null) {
    return <MaxColspanRow colspan={visibleColumns.length}>{SEARCH_TEXT}</MaxColspanRow>
  }

  if (sickLeaves.length === 0) {
    if (hasAppliedFilters) {
      return <MaxColspanRow colspan={visibleColumns.length}>{EMPTY_TEXT_FILTRATION}</MaxColspanRow>
    }

    return <MaxColspanRow colspan={visibleColumns.length}>{EMPTY_TEXT}</MaxColspanRow>
  }

  const navigateToPatient = (data: SickLeaveInfo) => {
    navigate(`/pagaende-sjukfall/${data.encryptedPatientId}`)
  }

  const sortedList = sortTableList(sickLeaves, getSickLeavesColumnData)

  return (
    <>
      {sortedList.map(
        (sickLeave) =>
          visibleColumns.length > 0 && (
            <TableRow
              key={sickLeave.patient.id}
              italic={isDateBeforeToday(sickLeave.slut)}
              onNavigate={(data) => navigateToPatient(data)}
              data={sickLeave}
              focusable
            >
              {visibleColumns.map(({ name }) => (
                <ResolveSickLeavesTableCell key={name} column={name} sickLeave={sickLeave} isDoctor={isDoctor} sickLeaves={sortedList} />
              ))}
            </TableRow>
          )
      )}
    </>
  )
}
