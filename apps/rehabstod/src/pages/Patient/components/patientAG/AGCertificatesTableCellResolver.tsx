import { DiagnosisDescription } from '../../../../components/Diagnosis/DiagnosisDescription'
import { DiagnosisInfo } from '../../../../components/Diagnosis/DiagnosisInfo'
import { SickLeaveDegreeInfo } from '../../../../components/SickLeave/SickLeaveDegreeInfo'
import { TableCell } from '../../../../components/Table/tableBody/TableCell'
import { AGCertificate } from '../../../../schemas/agCertificatesSchema'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { getUnansweredCommunicationFormat } from '../../../../utils/getUnansweredCommunicationFormat'
import { isTruthy } from '../../../../utils/isTruthy'
import { CertificateButton } from '../CertificateButton'
import { getAGCertificatesTableValue } from './agCertificatesTableValueFormatter'

export function AGCertificatesTableCellResolver({ column, data, list }: { column: string; data: AGCertificate; list: AGCertificate[] }) {
  switch (column) {
    case PatientColumn.Diagnos: {
      const diagnosis = [data.diagnosis, ...data.biDiagnoses].filter(isTruthy)
      return (
        <TableCell description={diagnosis.length > 0 && <DiagnosisDescription diagnosis={diagnosis} />}>
          <DiagnosisInfo biDiagnoser={data.biDiagnoses} diagnos={data.diagnosis} />
        </TableCell>
      )
    }
    case PatientColumn.Ärenden:
      return <TableCell>{getUnansweredCommunicationFormat(data.unAnsweredComplement, data.unAnsweredOther)}</TableCell>
    case PatientColumn.Intyg:
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
