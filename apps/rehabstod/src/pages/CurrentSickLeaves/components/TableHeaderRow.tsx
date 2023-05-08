import { TableHeaderCell } from '../../../components/Table/TableHeaderCell'
import { useGetUserQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { allSickLeaveColumns } from '../../../store/slices/sickLeaveTableColumns.selector'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'

function HeaderCellResolver({ column }: { column: string }) {
  const { data: user } = useGetUserQuery()

  switch (column) {
    case SickLeaveColumn.Personnummer:
      return <TableHeaderCell column={column} width="178px" />
    case SickLeaveColumn.Ålder:
      return <TableHeaderCell column={column} width="98px" />
    case SickLeaveColumn.Namn:
      return <TableHeaderCell column={column} width="136px" />
    case SickLeaveColumn.Kön:
      return <TableHeaderCell column={column} width="86px" />
    case SickLeaveColumn.Diagnos:
      return (
        <TableHeaderCell
          column={column}
          description="Diagnos/diagnoser i nuvarande intyg. Om det finns flera diagnoser så visas den som påverkar arbetsförmågan mest först. För muspekaren över diagnoskoden för att se diagnos i text."
          width="255px"
        />
      )
    case SickLeaveColumn.Sysselsättning:
      return <TableHeaderCell column={column} description="" width="240px" />
    case SickLeaveColumn.Startdatum:
      return (
        <TableHeaderCell
          column={column}
          description={`Datum då sjukfallet började på ${user?.valdVardenhet?.id}. Alla intyg för samma patient som följer på varandra med max ${user?.preferences?.maxAntalDagarSedanSjukfallAvslut} dagars uppehåll räknas till samma sjukfall. Max antal dagars uppehåll mellan intyg kan ställas in i inställningar.`}
          width="146px"
        />
      )
    case SickLeaveColumn.Slutdatum:
      return (
        <TableHeaderCell
          column={column}
          description="Slutdatum för sjukfallet, dvs. den sista dagen då det finns ett giltigt intyg."
          width="146px"
        />
      )
    case SickLeaveColumn.Längd:
      return (
        <TableHeaderCell
          column={column}
          description="Sjukfallets totala längd i dagar, från startdatum till slutdatum. Eventuella dagar mellan intyg räknas inte med."
          width="102px"
        />
      )
    case SickLeaveColumn.Intyg:
      return <TableHeaderCell column={column} description="Antalet intyg som ingår i sjukfallet." width="98px" />
    case SickLeaveColumn.Grad:
      return (
        <TableHeaderCell
          column={column}
          description="Sjukskrivningsgrad i nuvarande intyg. Om intyget innehåller flera grader anges de i tidsföljd med den just nu gällande graden i fetstil."
          width="98px"
        />
      )
    case SickLeaveColumn.Läkare:
      return (
        <TableHeaderCell
          column={column}
          description="Läkaren som utfärdat nuvarande intyg. Namnet hämtas från HSA-katalogen. Om namnet inte kan hämtas visas bara läkarens HSA-id."
          width="136px"
        />
      )
    default:
      return null
  }
}

export function TableHeaderRow({ showPersonalInformation }: { showPersonalInformation: boolean }) {
  const columns = useAppSelector(allSickLeaveColumns)

  if (columns.length === 0) {
    return null
  }

  return (
    <tr>
      {columns
        .filter(({ visible }) => visible)
        .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Personnummer))
        .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Namn))
        .map(({ name }) => (
          <HeaderCellResolver key={name} column={name} />
        ))}
    </tr>
  )
}
