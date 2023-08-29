import { Column } from '../../../components/Table/types/Column'
import { UserUrval } from '../../../schemas'
import { useGetUserQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { useGetSickLeavesFiltersQuery } from '../../../store/sickLeaveApi'
import { allSickLeaveColumns } from '../../../store/slices/sickLeaveTableColumns.selector'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'

const getSickLeaveColumnWidth = (column: string): number | undefined => {
  switch (column) {
    case SickLeaveColumn.Personnummer:
      return 145
    case SickLeaveColumn.Ålder:
    case SickLeaveColumn.Intyg:
      return 80
    case SickLeaveColumn.Namn:
      return 136
    case SickLeaveColumn.Kön:
      return 65
    case SickLeaveColumn.Diagnos:
      return 255
    case SickLeaveColumn.Sysselsättning:
      return 220
    case SickLeaveColumn.Startdatum:
    case SickLeaveColumn.Slutdatum:
      return 120
    case SickLeaveColumn.Längd:
      return 90
    case SickLeaveColumn.Grad:
      return 100
    case SickLeaveColumn.Läkare:
      return 114
    case SickLeaveColumn.RekoStatus:
    case SickLeaveColumn.Risk:
      return 150
    case SickLeaveColumn.Ärenden:
      return 200
    default:
      return undefined
  }
}

const getSickLeaveColumnDescription = (column: string, valdVardenhet?: string): string | undefined => {
  switch (column) {
    case SickLeaveColumn.Diagnos:
      return 'Diagnos/diagnoser i nuvarande intyg. Om det finns flera diagnoser så visas den som påverkar arbetsförmågan mest först.'
    case SickLeaveColumn.Startdatum:
      return `Datum då sjukfallet började på ${valdVardenhet}.`
    case SickLeaveColumn.Slutdatum:
      return 'Slutdatum för sjukfallet, dvs. den sista dagen då det finns ett giltigt intyg.'
    case SickLeaveColumn.Längd:
      return 'Sjukfallets totala längd i dagar, från startdatum till slutdatum. Dagar mellan intyg räknas inte.'
    case SickLeaveColumn.Intyg:
      return 'Antal intyg som ingår i sjukfallet.'
    case SickLeaveColumn.Grad:
      return 'Sjukskrivningsgrad i nuvarande intyg. Om intyget innehåller flera grader anges de i tidsföljd med den just nu gällande graden i fetstil.'
    case SickLeaveColumn.Läkare:
      return 'Läkaren som utfärdat nuvarande intyg. Namnet hämtas från HSA-katalogen. Om namnet inte kan hämtas visas bara läkarens HSA-id.'
    case SickLeaveColumn.Risk:
      return 'Patientens risk som beräknats av läkaren med hjälp av SRS i Webcert och är ett komplement till läkarens egen bedömning.'
    case SickLeaveColumn.Ärenden:
      return 'Visar om det finns intyg i sjukfallet som har obesvarade ärenden och hur många det är.'
    case SickLeaveColumn.RekoStatus:
      return 'REKO-status är ett sätt för Rehabkoordinatorer att göra en minnesnotering per sjukfall. Som Läkare kan du se men inte ange eller ändra REKO-status. Dessa alternativ finns: Ingen, Kontaktad, Aktiv, Uppföljning, Avslutad, Avböjt.'
    default:
      return undefined
  }
}

export function useSickLeavesTableColumn(): Column[] {
  const showPersonalInformation = useAppSelector((state) => state.settings.showPersonalInformation)
  const columns = useAppSelector(allSickLeaveColumns)
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const { data: user } = useGetUserQuery()

  const valdVardenhet = user?.valdVardenhet?.namn
  const isDoctor = user?.urval === UserUrval.ISSUED_BY_ME

  return columns
    .filter(({ visible }) => visible)
    .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Personnummer))
    .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Namn))
    .filter(({ name }) => !(isDoctor && name === SickLeaveColumn.Läkare))
    .filter(({ name }) => !(!populatedFilters?.srsActivated && name === SickLeaveColumn.Risk))
    .map(({ name }) => ({
      name,
      description: getSickLeaveColumnDescription(name, valdVardenhet),
      width: getSickLeaveColumnWidth(name),
    }))
}
