import { DiagnosisDescription } from '../../../../components/Diagnosis/DiagnosisDescription'
import { DiagnosisInfo } from '../../../../components/Diagnosis/DiagnosisInfo'
import { SickLeaveDegreeInfo } from '../../../../components/SickLeave/SickLeaveDegreeInfo'
import { TableCell } from '../../../../components/Table/tableBody/TableCell'
import { getUnansweredCommunicationFormat } from '../../../../components/UnansweredCommunication/utils/getUnansweredCommunicationFormat'
import { AGCertificate } from '../../../../schemas/agCertificatesSchema'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { CertificateButton } from '../../components/CertificateButton'
import { getAGCertificatesTableValue } from './agCertificatesTableValueFormatter'

export function AGCertificatesTableCellResolver({ column, data, list }: { column: string; data: AGCertificate; list: AGCertificate[] }) {
  switch (column) {
    case PatientColumn.Diagnos:
      return (
        <TableCell description={<DiagnosisDescription diagnos={data.diagnosis} biDiagnoser={data.biDiagnoses} />}>
          <DiagnosisInfo biDiagnoser={data.biDiagnoses} diagnos={data.diagnosis} />
        </TableCell>
      )
    case PatientColumn.Ärenden:
      return <TableCell>{getUnansweredCommunicationFormat(data.unAnsweredComplement, data.unAnsweredOther)}</TableCell>
    case PatientColumn.Visa:
      return (
        <TableCell sticky="right">
          <CertificateButton certificateId={data.certificateId} />
        </TableCell>
      )
    case PatientColumn.Grad:
      return (
        <TableCell>
          <SickLeaveDegreeInfo degrees={data.degree} />
        </TableCell>
      )
    default:
      return <TableCell>{getAGCertificatesTableValue(column, data, list)}</TableCell>
  }
}
