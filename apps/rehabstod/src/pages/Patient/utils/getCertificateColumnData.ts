import { PatientSjukfallIntyg } from '../../../schemas/patientSchema'
import { SickLeaveColumn } from '../../../schemas/sickLeaveSchema'

export function getCertificateColumnData(column: string, certificate: PatientSjukfallIntyg, list: PatientSjukfallIntyg[]) {
  switch (column) {
    case SickLeaveColumn.Num:
      return list.indexOf(certificate)
    case SickLeaveColumn.Diagnos:
      return certificate.diagnos.kod
    case SickLeaveColumn.Startdatum:
      return certificate.start
    case SickLeaveColumn.Slutdatum:
      return certificate.slut
    case SickLeaveColumn.Längd:
      return certificate.dagar
    case SickLeaveColumn.Läkare:
      return certificate.lakare.namn
    default:
      return undefined
  }
}
