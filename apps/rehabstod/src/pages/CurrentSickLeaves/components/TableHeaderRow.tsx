import { TableHeaderCell } from '../../../components/Table/TableHeaderCell'
import { SickLeaveColumn } from '../../../schemas/sickLeaveSchema'
import { useGetUserQuery } from '../../../store/api'

export function TableHeaderRow({
  showPersonalInformation,
  currentColumn,
  ascending,
  onColumnSort,
}: {
  showPersonalInformation: boolean
  ascending: boolean
  currentColumn: SickLeaveColumn
  onColumnSort: (column: SickLeaveColumn) => void
}) {
  const { data: user } = useGetUserQuery()

  return (
    <tr>
      {showPersonalInformation && (
        <TableHeaderCell
          title="Personnummer"
          column={SickLeaveColumn.Personnummer}
          ascending={ascending}
          currentColumn={currentColumn}
          onColumnSort={onColumnSort}
        />
      )}
      <TableHeaderCell
        title="Ålder"
        column={SickLeaveColumn.Ålder}
        ascending={ascending}
        currentColumn={currentColumn}
        onColumnSort={onColumnSort}
      />
      {showPersonalInformation && (
        <TableHeaderCell
          title="Namn"
          column={SickLeaveColumn.Namn}
          ascending={ascending}
          currentColumn={currentColumn}
          onColumnSort={onColumnSort}
        />
      )}
      <TableHeaderCell
        title="Kön"
        column={SickLeaveColumn.Kön}
        ascending={ascending}
        currentColumn={currentColumn}
        onColumnSort={onColumnSort}
      />
      <TableHeaderCell
        title="Diagnos/er"
        description="
Diagnos/diagnoser i nuvarande intyg. Om det finns flera diagnoser så visas den som påverkar arbetsförmågan mest först. För muspekaren över diagnoskoden för att se diagnos i text."
        column={SickLeaveColumn.Diagnos}
        ascending={ascending}
        currentColumn={currentColumn}
        onColumnSort={onColumnSort}
      />
      <TableHeaderCell
        title="Startdatum"
        description={`Datum då sjukfallet började på ${user?.valdVardenhet?.id}. Alla intyg för samma patient som följer på varandra med max ${user?.preferences?.maxAntalDagarSedanSjukfallAvslut} dagars uppehåll räknas till samma sjukfall. Max antal dagars uppehåll mellan intyg kan ställas in i inställningar.`}
        column={SickLeaveColumn.Startdatum}
        ascending={ascending}
        currentColumn={currentColumn}
        onColumnSort={onColumnSort}
      />
      <TableHeaderCell
        title="Slutdatum"
        description="Slutdatum för sjukfallet, dvs. den sista dagen då det finns ett giltigt intyg."
        column={SickLeaveColumn.Slutdatum}
        ascending={ascending}
        currentColumn={currentColumn}
        onColumnSort={onColumnSort}
      />
      <TableHeaderCell
        title="Längd"
        description="Sjukfallets totala längd i dagar, från startdatum till slutdatum. Eventuella dagar mellan intyg räknas inte med."
        column={SickLeaveColumn.Längd}
        ascending={ascending}
        currentColumn={currentColumn}
        onColumnSort={onColumnSort}
      />
      <TableHeaderCell
        title="Intyg"
        description="Antalet intyg som ingår i sjukfallet."
        column={SickLeaveColumn.Intyg}
        ascending={ascending}
        currentColumn={currentColumn}
        onColumnSort={onColumnSort}
      />
      <TableHeaderCell
        title="Grad"
        description="Sjukskrivningsgrad i nuvarande intyg. Om intyget innehåller flera grader anges de i tidsföljd med den just nu gällande graden i fetstil."
        column={SickLeaveColumn.Grad}
        ascending={ascending}
        currentColumn={currentColumn}
        onColumnSort={onColumnSort}
      />
      <TableHeaderCell
        title="Läkare"
        description="Läkaren som utfärdat nuvarande intyg. Namnet hämtas från HSA-katalogen. Om namnet inte kan hämtas visas bara läkarens HSA-id."
        column={SickLeaveColumn.Läkare}
        ascending={ascending}
        currentColumn={currentColumn}
        onColumnSort={onColumnSort}
      />
    </tr>
  )
}
