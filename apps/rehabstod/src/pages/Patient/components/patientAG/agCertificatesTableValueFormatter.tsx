import { AGCertificate } from '../../../../schemas/agCertificatesSchema'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'

export const getAGCertificatesTableValue = (column: string, data: AGCertificate, list?: AGCertificate[]) => {
  switch (column) {
    case PatientColumn.Intygstyp:
      return data.certificateType
    case PatientColumn.Startdatum:
      return data.start
    case PatientColumn.Slutdatum:
      return data.end
    case PatientColumn.Läkare:
      return data.doctor.namn
    case PatientColumn.Ärenden:
      return data.unAnsweredComplement + data.unAnsweredOther
    case PatientColumn.Diagnos:
      return data.diagnosis ? data.diagnosis.kod : 'Okänt'
    case PatientColumn.Vårdenhet:
      return data.careUnitName
    case PatientColumn.Vårdgivare:
      return data.careProviderName
    case PatientColumn.Sysselsättning:
      return data.occupation.map((occupation) => occupation).join(',\n')
    case PatientColumn.Längd:
      return `${data.days} dagar`
    case PatientColumn.Intyg:
      return 'Visa'
    case PatientColumn.Num:
      return list ? list.indexOf(data) + 1 : 0
    default:
      return undefined
  }
}
