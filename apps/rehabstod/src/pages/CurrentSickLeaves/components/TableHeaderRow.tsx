import { TableHeaderCell } from '../../../components/Table/TableHeaderCell'
import { useGetUserQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { allSjukfallColumns } from '../../../store/slices/sjukfallTableColumnsSelectors'
import { SjukfallColumn } from '../../../store/slices/sjukfallTableColumnsSlice'

function HeaderCellResolver({ column }: { column: string }) {
  const { data: user } = useGetUserQuery()

  switch (column) {
    case SjukfallColumn.Personnummer:
      return <TableHeaderCell column={column} width="178px" />
    case SjukfallColumn.Ålder:
      return <TableHeaderCell column={column} width="98px" />
    case SjukfallColumn.Namn:
      return <TableHeaderCell column={column} width="136px" />
    case SjukfallColumn.Kön:
      return <TableHeaderCell column={column} width="86px" />
    case SjukfallColumn.Diagnos:
      return (
        <TableHeaderCell
          column={column}
          description="Diagnos/diagnoser i nuvarande intyg. Om det finns flera diagnoser så visas den som påverkar arbetsförmågan mest först. För muspekaren över diagnoskoden för att se diagnos i text."
          width="255px"
        />
      )
    case SjukfallColumn.Sysselsättning:
      return <TableHeaderCell column={column} description="" width="240px" />
    case SjukfallColumn.Startdatum:
      return (
        <TableHeaderCell
          column={column}
          description={`Datum då sjukfallet började på ${user?.valdVardenhet?.id}. Alla intyg för samma patient som följer på varandra med max ${user?.preferences?.maxAntalDagarSedanSjukfallAvslut} dagars uppehåll räknas till samma sjukfall. Max antal dagars uppehåll mellan intyg kan ställas in i inställningar.`}
          width="146px"
        />
      )
    case SjukfallColumn.Slutdatum:
      return (
        <TableHeaderCell
          column={column}
          description="Slutdatum för sjukfallet, dvs. den sista dagen då det finns ett giltigt intyg."
          width="146px"
        />
      )
    case SjukfallColumn.Längd:
      return (
        <TableHeaderCell
          column={column}
          description="Sjukfallets totala längd i dagar, från startdatum till slutdatum. Eventuella dagar mellan intyg räknas inte med."
          width="102px"
        />
      )
    case SjukfallColumn.Intyg:
      return <TableHeaderCell column={column} description="Antalet intyg som ingår i sjukfallet." width="98px" />
    case SjukfallColumn.Grad:
      return (
        <TableHeaderCell
          column={column}
          description="Sjukskrivningsgrad i nuvarande intyg. Om intyget innehåller flera grader anges de i tidsföljd med den just nu gällande graden i fetstil."
          width="98px"
        />
      )
    case SjukfallColumn.Läkare:
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
  const columns = useAppSelector(allSjukfallColumns)

  if (columns.length === 0) {
    return null
  }

  return (
    <tr>
      {columns
        .filter(({ visible }) => visible)
        .filter(({ name }) => !(showPersonalInformation === false && name === SjukfallColumn.Personnummer))
        .filter(({ name }) => !(showPersonalInformation === false && name === SjukfallColumn.Namn))
        .map(({ name }) => (
          <HeaderCellResolver key={name} column={name} />
        ))}
    </tr>
  )
}
