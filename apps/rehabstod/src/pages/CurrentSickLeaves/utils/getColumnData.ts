import { SickLeaveColumn, SickLeaveInfo } from '../../../schemas/sickLeaveSchema'

export function getColumnData(column: SickLeaveColumn, sickLeave: SickLeaveInfo) {
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
      return sickLeave.diagnos.kod
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
    default:
      return undefined
  }
}
