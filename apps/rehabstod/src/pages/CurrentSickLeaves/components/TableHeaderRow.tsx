import { TableHeaderCell } from '../../../components/Table/TableHeaderCell'
import { SickLeaveColumn } from '../../../schemas/sickLeaveSchema'
import { useGetUserQuery } from '../../../store/api'

export function TableHeaderRow({ showPersonalInformation }: { showPersonalInformation: boolean }) {
  const { data: user } = useGetUserQuery()

  return (
    <tr>
      {showPersonalInformation && <TableHeaderCell column={SickLeaveColumn.Personnummer} />}
      <TableHeaderCell column={SickLeaveColumn.Ålder} />
      {showPersonalInformation && <TableHeaderCell column={SickLeaveColumn.Namn} />}
      <TableHeaderCell column={SickLeaveColumn.Kön} />
      <TableHeaderCell
        column={SickLeaveColumn.Diagnos}
        description="Diagnos/diagnoser i nuvarande intyg. Om det finns flera diagnoser så visas den som påverkar arbetsförmågan mest först. För muspekaren över diagnoskoden för att se diagnos i text."
      />
      <TableHeaderCell
        column={SickLeaveColumn.Startdatum}
        description={`Datum då sjukfallet började på ${user?.valdVardenhet?.id}. Alla intyg för samma patient som följer på varandra med max ${user?.preferences?.maxAntalDagarSedanSjukfallAvslut} dagars uppehåll räknas till samma sjukfall. Max antal dagars uppehåll mellan intyg kan ställas in i inställningar.`}
      />
      <TableHeaderCell
        column={SickLeaveColumn.Slutdatum}
        description="Slutdatum för sjukfallet, dvs. den sista dagen då det finns ett giltigt intyg."
      />
      <TableHeaderCell
        column={SickLeaveColumn.Längd}
        description="Sjukfallets totala längd i dagar, från startdatum till slutdatum. Eventuella dagar mellan intyg räknas inte med."
      />
      <TableHeaderCell column={SickLeaveColumn.Intyg} description="Antalet intyg som ingår i sjukfallet." />
      <TableHeaderCell
        column={SickLeaveColumn.Grad}
        description="Sjukskrivningsgrad i nuvarande intyg. Om intyget innehåller flera grader anges de i tidsföljd med den just nu gällande graden i fetstil."
      />
      <TableHeaderCell
        column={SickLeaveColumn.Läkare}
        description="Läkaren som utfärdat nuvarande intyg. Namnet hämtas från HSA-katalogen. Om namnet inte kan hämtas visas bara läkarens HSA-id."
      />
    </tr>
  )
}
