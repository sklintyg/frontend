import { useState } from 'react'
import { TableLayout } from '../../components/Table/TableLayout'
import { CurrentSickLeavesFilters } from '../../components/Table/CurrentSickLeaves/CurrentSickLeavesFilters'
import { useGetUserQuery, useLazyGetSickLeavesQuery } from '../../store/api'

export const CURRENT_SICK_LEAVES_TITLE = 'Pågående sjukfall'

export const CURRENT_SICK_LEAVES_TABLE_HEADERS = [
  'Personnummer',
  'Ålder',
  'Namn',
  'Kön',
  'Diagnos/er',
  'Startdatum',
  'Slutdatum',
  'Längd',
  'Intyg',
  'Grad',
  'Läkare',
]

export function CurrentSickLeaves() {
  // const { data: currentSickLeaves } = useGetSickLeavesQuery(5)
  const { data: user } = useGetUserQuery()
  const [triggerGetSickLeaves, { data: currentSickLeaves }] = useLazyGetSickLeavesQuery()
  const defaultColumn = 5
  const [sortedColumn, setSortedColumn] = useState(defaultColumn)
  const [ascending, setAscending] = useState(false)
  const [tableHeaders, setTableHeaders] = useState(CURRENT_SICK_LEAVES_TABLE_HEADERS)

  const onSort = (index: number) => {
    setAscending(index === sortedColumn ? !ascending : false)
    setSortedColumn(index)
    // dispatch sort
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

  return (
    <TableLayout
      title={CURRENT_SICK_LEAVES_TITLE}
      subTitle={user && user.valdVardenhet ? user.valdVardenhet.namn : ''}
      tableHeaders={tableHeaders}
      id="sickleave"
      onSort={onSort}
      sortedColumn={sortedColumn}
      ascending={ascending}
      content={currentSickLeaves || []}
      filters={
        <CurrentSickLeavesFilters
          onSearch={() => {
            triggerGetSickLeaves(5)
          }}
          onReset={handleReset}
          onShowPersonalInformation={onShowPersonalInformation}
        />
      }
    />
  )
}
