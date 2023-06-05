import { PatientSjukfallIntyg } from '../../../schemas/patientSchema'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'

export function getCertificateColumnData(column: string, certificate: PatientSjukfallIntyg, list: PatientSjukfallIntyg[]) {
  switch (column) {
    case PatientColumn.Num:
      return list.indexOf(certificate)
    case PatientColumn.Startdatum:
      return certificate.start
    case PatientColumn.Diagnos:
      return certificate.diagnos ? certificate.diagnos.kod : 'Okänt'
    case PatientColumn.Slutdatum:
      return certificate.slut
    case PatientColumn.Längd:
      return certificate.dagar
    case PatientColumn.Läkare:
      return certificate.lakare ? certificate.lakare.namn : 'Okänt'
    default:
      return undefined
  }
}
