import { getUnansweredCommunicationsFormat } from '../../../components/SickLeave/utils/getUnansweredCommunicationsFormat'
import { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'

export function getSickLeavesColumnData(column: string, sickLeave: SickLeaveInfo) {
  switch (column) {
    case SickLeaveColumn.Personnummer:
      return sickLeave.patient.id
    case SickLeaveColumn.Ålder:
      return `${sickLeave.patient.alder} år`
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
      return `${sickLeave.dagar} dagar`
    case SickLeaveColumn.Intyg:
      return sickLeave.intyg
    case SickLeaveColumn.Grad:
      return sickLeave.aktivGrad
    case SickLeaveColumn.Läkare:
      return sickLeave.lakare.namn
    case SickLeaveColumn.Sysselsättning:
      return sickLeave.sysselsattning.map((occupation) => occupation).join(',\n')
    case SickLeaveColumn.RekoStatus:
      return sickLeave.rekoStatus ? sickLeave.rekoStatus.status.name : 'Ingen'
    case SickLeaveColumn.Risk:
      return sickLeave.riskSignal ? sickLeave.riskSignal.riskKategori : 0
    case SickLeaveColumn.Ärenden:
      return getUnansweredCommunicationsFormat(sickLeave.obesvaradeKompl, sickLeave.unansweredOther)
    default:
      return undefined
  }
}
