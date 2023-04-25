import { TableHeaderCell } from '../../../components/Table/TableHeaderCell'
import { useGetUserQuery } from '../../../store/api'
import { SjukfallColumn } from '../../../store/slices/sjukfallTableColumnsSlice'

export function TableHeaderRow({ showPersonalInformation }: { showPersonalInformation: boolean }) {
  const { data: user } = useGetUserQuery()

  return (
    <tr>
      {showPersonalInformation && <TableHeaderCell column={SjukfallColumn.Personnummer} width="178px" />}
      <TableHeaderCell column={SjukfallColumn.Ålder} width="98px" />
      {showPersonalInformation && <TableHeaderCell column={SjukfallColumn.Namn} width="136px" />}
      <TableHeaderCell column={SjukfallColumn.Kön} width="86px" />
      <TableHeaderCell
        column={SjukfallColumn.Diagnos}
        description="Diagnos/diagnoser i nuvarande intyg. Om det finns flera diagnoser så visas den som påverkar arbetsförmågan mest först. För muspekaren över diagnoskoden för att se diagnos i text."
        width="255px"
      />
      <TableHeaderCell column={SjukfallColumn.Sysselsättning} description="" width="240px" />
      <TableHeaderCell
        column={SjukfallColumn.Startdatum}
        description={`Datum då sjukfallet började på ${user?.valdVardenhet?.id}. Alla intyg för samma patient som följer på varandra med max ${user?.preferences?.maxAntalDagarSedanSjukfallAvslut} dagars uppehåll räknas till samma sjukfall. Max antal dagars uppehåll mellan intyg kan ställas in i inställningar.`}
        width="146px"
      />
      <TableHeaderCell
        column={SjukfallColumn.Slutdatum}
        description="Slutdatum för sjukfallet, dvs. den sista dagen då det finns ett giltigt intyg."
        width="146px"
      />
      <TableHeaderCell
        column={SjukfallColumn.Längd}
        description="Sjukfallets totala längd i dagar, från startdatum till slutdatum. Eventuella dagar mellan intyg räknas inte med."
        width="102px"
      />
      <TableHeaderCell column={SjukfallColumn.Intyg} description="Antalet intyg som ingår i sjukfallet." width="98px" />
      <TableHeaderCell
        column={SjukfallColumn.Grad}
        description="Sjukskrivningsgrad i nuvarande intyg. Om intyget innehåller flera grader anges de i tidsföljd med den just nu gällande graden i fetstil."
        width="98px"
      />
      <TableHeaderCell
        column={SjukfallColumn.Läkare}
        description="Läkaren som utfärdat nuvarande intyg. Namnet hämtas från HSA-katalogen. Om namnet inte kan hämtas visas bara läkarens HSA-id."
        width="136px"
      />
    </tr>
  )
}
