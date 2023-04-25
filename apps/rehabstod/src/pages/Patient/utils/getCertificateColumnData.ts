import { PatientSjukfallIntyg } from '../../../schemas/patientSchema'
import { PatientColumn } from '../../../store/slices/patientTableColumnsSlice'

export function getCertificateColumnData(column: string, certificate: PatientSjukfallIntyg, list: PatientSjukfallIntyg[]) {
  switch (column) {
    case PatientColumn.Num:
      return list.indexOf(certificate)
    case PatientColumn.Diagnos:
      return certificate.diagnos.kod
    case PatientColumn.Startdatum:
      return certificate.start
    case PatientColumn.Slutdatum:
      return certificate.slut
    case PatientColumn.Längd:
      return certificate.dagar
    case PatientColumn.Läkare:
      return certificate.lakare.namn
    default:
      return undefined
  }
}
