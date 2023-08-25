import { DiagnosisDescription } from '../../components/Diagnosis/DiagnosisDescription'
import { DiagnosisInfo } from '../../components/Diagnosis/DiagnosisInfo'
import { TableCell } from '../../components/Table/tableBody/TableCell'
import { LUCertificate } from '../../schemas/luCertificatesSchema'
import { LUCertificatesColumn } from '../../store/slices/luUnitTableColumns.slice'
import { getUnansweredCommunicationFormat } from '../../utils/getUnansweredCommunicationFormat'
import { CertificateButton } from '../Patient/components/CertificateButton'
import { getLUCertificatesTableValue } from './utils/luCertificatesTableValueFormatter'

export function LUCertificatesTableCellResolver({ column, data, list }: { column: string; data: LUCertificate; list: LUCertificate[] }) {
  switch (column) {
    case LUCertificatesColumn.Diagnos: {
      const diagnosis = [data.diagnosis, ...data.biDiagnoses].filter(Boolean)
      return (
        <TableCell description={diagnosis.length > 0 && <DiagnosisDescription diagnosis={diagnosis} />}>
          <DiagnosisInfo biDiagnoser={data.biDiagnoses} diagnos={data.diagnosis} />
        </TableCell>
      )
    }
    case LUCertificatesColumn.Signeringsdatum:
      return <TableCell>{(getLUCertificatesTableValue(column, data) as string).split('T')[0]}</TableCell>
    case LUCertificatesColumn.Ärenden:
      return <TableCell>{getUnansweredCommunicationFormat(data.unAnsweredComplement, data.unAnsweredOther)}</TableCell>
    case LUCertificatesColumn.Intyg:
      return (
        <TableCell sticky="right">
          <CertificateButton certificateId={data.certificateId} />
        </TableCell>
      )
    default:
      return <TableCell>{getLUCertificatesTableValue(column, data, list)}</TableCell>
  }
}
