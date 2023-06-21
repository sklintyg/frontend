import { LUCertificate } from '../../../schemas/luCertificatesSchema'
import { LUCertificatesColumn } from '../../../store/slices/luCertificatesTableColumns.slice'

export const getLUCertificatesTableValue = (column: string, data: LUCertificate) => {
  switch (column) {
    case LUCertificatesColumn.Personnummer:
      return data.patient.id
    case LUCertificatesColumn.Ålder:
      return data.patient.alder
    case LUCertificatesColumn.Kön:
      return data.patient.kon === 'F' ? 'Kvinna' : 'Man'
    case LUCertificatesColumn.Namn:
      return data.patient.namn
    case LUCertificatesColumn.Intyg:
      return data.certificateType
    case LUCertificatesColumn.Signeringsdatum:
      return data.signingTimeStamp
    case LUCertificatesColumn.Läkare:
      return data.doctor.namn
    case LUCertificatesColumn.Ärenden:
      return data.unAnsweredComplement + data.unAnsweredOther
    case LUCertificatesColumn.Diagnos:
      return data.diagnosis ? data.diagnosis.kod : 'Okänt'
    default:
      return undefined
  }
}

export const getLUCertificatesId = (data: LUCertificate) => data.certificateId
// TODO: this should be switched to encrypted patient id
