import { getUnansweredCommunicationsFormat } from '../../../components/UnansweredCommunication/utils/getUnansweredCommunicationsFormat'
import { PatientSjukfallIntyg } from '../../../schemas/patientSchema'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'

export function getCertificateColumnData(column: string, certificate: PatientSjukfallIntyg, list: PatientSjukfallIntyg[]) {
  switch (column) {
    case PatientColumn.Num:
      return list.indexOf(certificate) + 1
    case PatientColumn.Grad:
      return certificate.grader.length > 0 ? certificate.grader.map((val) => `${val}%`).join(' ') : 'Okänt'
    case PatientColumn.Startdatum:
      return certificate.start
    case PatientColumn.Diagnos:
      return certificate.diagnos ? certificate.diagnos.kod : 'Okänt'
    case PatientColumn.Slutdatum:
      return certificate.slut
    case PatientColumn.Längd:
      return certificate.dagar
    case PatientColumn.Ärenden:
      return getUnansweredCommunicationsFormat(certificate.obesvaradeKompl, certificate.unansweredOther)
    case PatientColumn.Sysselsättning:
      return certificate.sysselsattning.length > 0 ? certificate.sysselsattning.join(' ') : 'Okänt'
    case PatientColumn.Vårdenhet:
      return certificate.vardenhetNamn
    case PatientColumn.Vårdgivare:
      return certificate.vardgivareNamn
    case PatientColumn.Läkare:
      return certificate.lakare ? certificate.lakare.namn : 'Okänt'
    default:
      return undefined
  }
}
