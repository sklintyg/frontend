import { TableLayout } from '../../components/Table/TableLayout'
import { CurrentSickLeavesFilters } from '../../components/Table/CurrentSickLeaves/CurrentSickLeavesFilters'
import { useLazyGetSickLeavesQuery } from '../../store/api'

export const CURRENT_SICK_LEAVES_TITLE = 'Pågående sjukfall'

export function CurrentSickLeaves() {
  //const { data: currentSickLeaves } = useGetSickLeavesQuery(5)
  const [triggerGetSickLeaves, { data: currentSickLeaves }] = useLazyGetSickLeavesQuery()

  const TABLE_HEADERS = [
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

  return (
    <TableLayout
      title={CURRENT_SICK_LEAVES_TITLE}
      subTitle="Enhetsnamn"
      tableHeaders={TABLE_HEADERS}
      id="sickleave"
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
