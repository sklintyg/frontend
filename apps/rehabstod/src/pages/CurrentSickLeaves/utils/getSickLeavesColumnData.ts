import { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { SjukfallColumn } from '../../../store/slices/sjukfallTableColumnsSlice'

export function getSickLeavesColumnData(column: string, sickLeave: SickLeaveInfo) {
  switch (column) {
    case SjukfallColumn.Personnummer:
      return sickLeave.patient.id
    case SjukfallColumn.Ålder:
      return sickLeave.patient.alder
    case SjukfallColumn.Namn:
      return sickLeave.patient.namn
    case SjukfallColumn.Kön:
      return sickLeave.patient.kon === 'F' ? 'Kvinna' : 'Man'
    case SjukfallColumn.Diagnos:
      return sickLeave.diagnos.kod
    case SjukfallColumn.Startdatum:
      return sickLeave.start
    case SjukfallColumn.Slutdatum:
      return sickLeave.slut
    case SjukfallColumn.Längd:
      return sickLeave.dagar
    case SjukfallColumn.Intyg:
      return sickLeave.intyg
    case SjukfallColumn.Grad:
      return sickLeave.aktivGrad
    case SjukfallColumn.Läkare:
      return sickLeave.lakare.namn
    default:
      return undefined
  }
}
