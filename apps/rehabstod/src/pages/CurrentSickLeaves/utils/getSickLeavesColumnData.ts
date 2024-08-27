import type { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'

export function getSickLeavesColumnData(column: string, sickLeave: SickLeaveInfo, list?: SickLeaveInfo[]) {
  switch (column) {
    case SickLeaveColumn.Personnummer:
      return sickLeave.patient.id
    case SickLeaveColumn.Ålder:
      return sickLeave.patient.alder
    case SickLeaveColumn.Namn:
      return sickLeave.patient.namn
    case SickLeaveColumn.Kön:
      return sickLeave.patient.kon === 'F' ? 'Kvinna' : 'Man'
    case SickLeaveColumn.Diagnos:
      return sickLeave.diagnos ? sickLeave.diagnos.kod : 'Okänt'
    case SickLeaveColumn.Startdatum:
      return sickLeave.start
    case SickLeaveColumn.Slutdatum:
      return sickLeave.slut
    case SickLeaveColumn.Längd:
      return sickLeave.dagar
    case SickLeaveColumn.Intyg:
      return sickLeave.intyg
    case SickLeaveColumn.Grad:
      return sickLeave.aktivGrad
    case SickLeaveColumn.Läkare:
      return sickLeave.lakare.namn
    case SickLeaveColumn.Sysselsättning:
      return sickLeave.sysselsattning.map((occupation) => occupation).join(',\n')
    case SickLeaveColumn.Status:
      return sickLeave.rekoStatus ? sickLeave.rekoStatus.status.name : 'Ingen'
    case SickLeaveColumn.Risk:
      return sickLeave.riskSignal ? sickLeave.riskSignal.riskKategori : 0
    case SickLeaveColumn.Ärenden:
      return sickLeave.unansweredOther + sickLeave.obesvaradeKompl
    case SickLeaveColumn.Index:
      return list ? list.indexOf(sickLeave) + 1 : 0
    default:
      return undefined
  }
}
