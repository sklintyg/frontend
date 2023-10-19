import { DiagnosisInfoCell } from '../../../components/DiagnosisInfo/DiagnosisInfoCell'
import { TableCell } from '../../../components/Table/tableBody/TableCell'
import { LUCertificate } from '../../../schemas/luCertificatesSchema'
import { LUCertificatesColumn } from '../../../store/slices/luUnitTableColumns.slice'
import { getUnansweredCommunicationFormat } from '../../../utils/getUnansweredCommunicationFormat'
import { CertificateButton } from '../../Patient/components/CertificateButton'
import { getLUCertificatesTableValue } from '../utils/luCertificatesTableValueFormatter'

export function LUCertificatesTableCellResolver({ column, data, list }: { column: string; data: LUCertificate; list: LUCertificate[] }) {
  switch (column) {
    case LUCertificatesColumn.Diagnos:
      return <DiagnosisInfoCell diagnosis={data.diagnosis} biDiagnoses={data.biDiagnoses} />
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
