import { IDSSpinner } from '@inera/ids-react'
import { useNavigate } from 'react-router-dom'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { MaxColspanRow } from '../../../components/Table/tableBody/MaxColspanRow'
import { TableRow } from '../../../components/Table/tableBody/TableRow'
import { getEmptyFiltrationText, getEmptyTableText, getSearchText } from '../../../components/Table/utils/tableTextGeneratorUtils'
import type { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { useGetUserQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
import { isUserDoctor } from '../../../utils/isUserDoctor'
import { useSickLeavesTableColumn } from '../hooks/useSickLeavesTableColumns'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'
import { ResolveSickLeavesTableCell } from './ResolveSickLeavesTableCell'

export function TableBodyRows({ isLoading, sickLeaves }: { isLoading: boolean; sickLeaves?: SickLeaveInfo[] }) {
  const navigate = useNavigate()
  const { data: user } = useGetUserQuery()
  const { sortTableList } = useTableContext()
  const columns = useSickLeavesTableColumn()
  const hasAppliedFilters = useAppSelector((state) => state.sickLeaveFilter.hasAppliedFilters)
  const isDoctor = user ? isUserDoctor(user) : false

  const TABLE_NAME = 'pågående sjukfall'
  const EMPTY_TEXT = getEmptyTableText(user, TABLE_NAME)
  const SEARCH_TEXT = getSearchText(isDoctor, TABLE_NAME)
  const EMPTY_TEXT_FILTRATION = getEmptyFiltrationText(TABLE_NAME)

  if (isLoading) {
    return (
      <MaxColspanRow colspan={columns.length}>
        <IDSSpinner />
      </MaxColspanRow>
    )
  }

  if (sickLeaves == null) {
    return <MaxColspanRow colspan={columns.length}>{SEARCH_TEXT}</MaxColspanRow>
  }

  if (sickLeaves.length === 0) {
    if (hasAppliedFilters) {
      return <MaxColspanRow colspan={columns.length}>{EMPTY_TEXT_FILTRATION}</MaxColspanRow>
    }

    return <MaxColspanRow colspan={columns.length}>{EMPTY_TEXT}</MaxColspanRow>
  }

  const navigateToPatient = (data: SickLeaveInfo) => {
    navigate(`/pagaende-sjukfall/${data.encryptedPatientId}`)
  }

  const sortedList = sortTableList(sickLeaves, getSickLeavesColumnData)

  return (
    <>
      {sortedList.map(
        (sickLeave) =>
          columns.length > 0 && (
            <TableRow
              key={sickLeave.patient.id}
              italic={isDateBeforeToday(sickLeave.slut)}
              onNavigate={(data) => navigateToPatient(data)}
              data={sickLeave}
              focusable
            >
              {columns.map(({ name }) => (
                <ResolveSickLeavesTableCell key={name} column={name} sickLeave={sickLeave} isDoctor={isDoctor} sickLeaves={sortedList} />
              ))}
            </TableRow>
          )
      )}
    </>
  )
}
