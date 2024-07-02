import { DiagnosisInfoCell } from '../../../../components/DiagnosisInfo/DiagnosisInfoCell'
import { SickLeaveDegreeInfo } from '../../../../components/SickLeave/SickLeaveDegreeInfo'
import { TableCell } from '../../../../components/Table/tableBody/TableCell'
import type { AGCertificate } from '../../../../schemas/agCertificatesSchema'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { getUnansweredCommunicationFormat } from '../../../../utils/getUnansweredCommunicationFormat'
import { CertificateButton } from '../CertificateButton'
import { getAGCertificatesTableValue } from './agCertificatesTableValueFormatter'

export function AGCertificatesTableCellResolver({ column, data, list }: { column: string; data: AGCertificate; list: AGCertificate[] }) {
  switch (column) {
    case PatientColumn.Diagnos:
      return <DiagnosisInfoCell diagnosis={data.diagnosis} biDiagnoses={data.biDiagnoses} />
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
