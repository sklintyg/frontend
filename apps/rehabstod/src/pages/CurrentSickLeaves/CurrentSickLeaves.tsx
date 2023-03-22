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
  //const { data: currentSickLeaves } = useGetSickLeavesQuery(5)
  const { data: user } = useGetUserQuery()
  const [triggerGetSickLeaves, { data: currentSickLeaves }] = useLazyGetSickLeavesQuery()

  const onSort = (index: number) => {
    //dispatch sort
  }

  return (
    <TableLayout
      title={CURRENT_SICK_LEAVES_TITLE}
      subTitle={user && user.valdVardenhet ? user.valdVardenhet.namn : ''}
      tableHeaders={CURRENT_SICK_LEAVES_TABLE_HEADERS}
      id="sickleave"
      onSort={onSort}
      content={currentSickLeaves ? currentSickLeaves : []}
      filters={
        <CurrentSickLeavesFilters
          onSearch={() => {
            triggerGetSickLeaves(5)
          }}
        />
      }
    />
  )
}
