import { LUCertificate } from '../../schemas/luCertificatesSchema'
import { LUCertificatesColumn } from '../../store/slices/luCertificatesTableColumns.slice'
import { TableCell } from '../../components/Table/tableBody/TableCell'
import { DiagnosisDescription } from '../../components/Diagnosis/DiagnosisDescription'
import { DiagnosisInfo } from '../../components/Diagnosis/DiagnosisInfo'
import { getUnansweredCommunicationFormat } from '../../components/UnansweredCommunication/utils/getUnansweredCommunicationFormat'
import { getLUCertificatesTableValue } from './utils/luCertificatesTableValueFormatter'
import { CertificateButton } from '../Patient/components/CertificateButton'

export function LUCertificatesTableCellResolver({ column, data, list }: { column: string; data: LUCertificate; list: LUCertificate[] }) {
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
      return <TableCell>{getUnansweredCommunicationFormat(data.unAnsweredComplement, data.unAnsweredOther)}</TableCell>
    case LUCertificatesColumn.Visa:
      return (
        <TableCell sticky="right">
          <CertificateButton certificateId={data.certificateId} />
        </TableCell>
      )
    default:
      return <TableCell>{getLUCertificatesTableValue(column, data, list)}</TableCell>
  }
}
