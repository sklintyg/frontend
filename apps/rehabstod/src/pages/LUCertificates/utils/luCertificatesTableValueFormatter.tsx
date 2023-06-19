import { LUCertificate } from '../../../schemas/luCertificatesSchema'
import { LUCertificatesColumn } from '../../../store/slices/luCertificatesTableColumns.slice'
import { TableCell } from '../../../components/Table/TableCell'
import { DiagnosisInfo } from '../../../components/Diagnosis/DiagnosisInfo'
import { DiagnosisDescription } from '../../../components/Diagnosis/DiagnosisDescription'
import { getUnansweredCommunicationsFormat } from '../../../components/UnansweredCommunication/utils/getUnansweredCommunicationsFormat'

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

export const getLUCertificatesTableCell = (column: string, data: LUCertificate) => {
  switch (column) {
    case LUCertificatesColumn.Diagnos:
      return (
        <TableCell description={<DiagnosisDescription diagnos={data.diagnosis} biDiagnoser={data.biDiagnoses} />}>
          <DiagnosisInfo biDiagnoser={data.biDiagnoses} diagnos={data.diagnosis} />
        </TableCell>
      )
    case LUCertificatesColumn.Signeringsdatum:
      return <TableCell>{(getLUCertificatesTableValue(column, data) as string).split('T')[0]}</TableCell>
    case LUCertificatesColumn.Ärenden:
      return <TableCell>{getUnansweredCommunicationsFormat(data.unAnsweredComplement, data.unAnsweredOther)}</TableCell>
    default:
      return <TableCell>{getLUCertificatesTableValue(column, data)}</TableCell>
  }
}
