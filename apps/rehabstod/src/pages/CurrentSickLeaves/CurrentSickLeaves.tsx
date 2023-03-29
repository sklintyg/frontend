import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TableLayout } from '../../components/Table/Layout/TableLayout'
import { CurrentSickLeavesFilters } from '../../components/Table/CurrentSickLeaves/CurrentSickLeavesFilters'
import { useGetSickLeavesMutation, useGetUserQuery } from '../../store/api'
import { CurrentSickLeavesTableInfo } from '../../components/Table/CurrentSickLeaves/CurrentSickLeavesTableInfo'
import {
  CURRENT_SICK_LEAVES_TABLE_HEADERS,
  getCurrentSickLeavesSortFunction,
  getCurrentSickLeavesTableHeaderDescription,
} from '../../utils/listUtils'

export const CURRENT_SICK_LEAVES_TITLE = 'Pågående sjukfall'

export function CurrentSickLeaves() {
  const navigate = useNavigate()
  const { data: user } = useGetUserQuery()
  const [triggerGetSickLeaves, { isLoading, data: sickLeavesResponse }] = useGetSickLeavesMutation()
  const currentSickLeaves = sickLeavesResponse ? sickLeavesResponse.content : undefined
  const defaultColumn = 5
  const [sortedColumn, setSortedColumn] = useState(defaultColumn)
  const [ascending, setAscending] = useState(false)
  const [tableHeaders, setTableHeaders] = useState(CURRENT_SICK_LEAVES_TABLE_HEADERS)

  const tableHeaderDescriptions = user
    ? tableHeaders.map((header) =>
        getCurrentSickLeavesTableHeaderDescription(
          header,
          user.valdVardenhet ? user.valdVardenhet.id : '',
          user.preferences.maxAntalDagarMellanIntyg
        )
      )
    : []

  const onSort = (index: number) => {
    setAscending(index === sortedColumn ? !ascending : false)
    setAscending(index === sortedColumn ? !ascending : false)
    setSortedColumn(index)
  }

  const handleReset = () => {
    setAscending(false)
    setSortedColumn(defaultColumn)
  }

  const onShowPersonalInformation = (isChecked: boolean) => {
    if (isChecked) {
      setTableHeaders(CURRENT_SICK_LEAVES_TABLE_HEADERS)
    } else {
      setTableHeaders(CURRENT_SICK_LEAVES_TABLE_HEADERS.filter((header) => header !== 'Personnummer' && header !== 'Namn'))
    }
  }

  const getSortedSickLeaves = () => {
    if (!currentSickLeaves) {
      return []
    }
    const sorted = currentSickLeaves
      .slice()
      .sort((a, b) => getCurrentSickLeavesSortFunction(CURRENT_SICK_LEAVES_TABLE_HEADERS[sortedColumn], a, b))

    return ascending ? sorted.reverse() : sorted
  }

  if (!user) {
    navigate('/')
  }

  return (
    <TableLayout
      title={CURRENT_SICK_LEAVES_TITLE}
      subTitle={user && user.valdVardenhet ? user.valdVardenhet.namn : ''}
      isLoading={isLoading}
      tableHeaders={tableHeaders}
      tableHeaderDescriptions={tableHeaderDescriptions}
      id="sickleave"
      onSort={onSort}
      sortedColumn={sortedColumn}
      ascending={ascending}
      content={currentSickLeaves ? getSortedSickLeaves() : undefined}
      infoBar={
        <CurrentSickLeavesTableInfo
          onShowPersonalInformation={onShowPersonalInformation}
          totalNumber={!currentSickLeaves ? 0 : currentSickLeaves.length}
          listLength={!currentSickLeaves ? 0 : currentSickLeaves.length}
          daysAfterSickLeaveEnd={!user ? '' : user.preferences.maxAntalDagarMellanIntyg}
          daysBetweenCertificates={!user ? '' : user.preferences.maxAntalDagarSedanSjukfallAvslut}
        />
      }
      filters={<CurrentSickLeavesFilters onSearch={() => triggerGetSickLeaves()} onReset={handleReset} />}
    />
  )
}
