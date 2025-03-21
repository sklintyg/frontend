import type { LUCertificate } from '../../../schemas/luCertificatesSchema'
import { LUCertificatesColumn } from '../../../store/slices/luUnitTableColumns.slice'

export const getLUCertificatesTableValue = (column: string, data: LUCertificate, list?: LUCertificate[]) => {
  switch (column) {
    case LUCertificatesColumn.Personnummer:
      return data.patient.id
    case LUCertificatesColumn.Ålder:
      return data.patient.alder
    case LUCertificatesColumn.Kön:
      return data.patient.kon === 'F' ? 'Kvinna' : 'Man'
    case LUCertificatesColumn.Namn:
      return data.patient.namn
    case LUCertificatesColumn.Intygstyp:
      return data.certificateType
    case LUCertificatesColumn.Signeringsdatum:
      return data.signingTimeStamp
    case LUCertificatesColumn.Läkare:
      return data.doctor.namn
    case LUCertificatesColumn.Ärenden:
      return data.unAnsweredComplement + data.unAnsweredOther
    case LUCertificatesColumn.Diagnos:
      return data.diagnosis ? data.diagnosis.kod : 'Okänt'
    case LUCertificatesColumn.Vårdenhet:
      return data.careUnitName
    case LUCertificatesColumn.Vårdgivare:
      return data.careProviderName
    case LUCertificatesColumn.Intyg:
      return 'Visa'
    case LUCertificatesColumn.Index:
      return list ? list.indexOf(data) + 1 : 0
    default:
      return undefined
  }
}
