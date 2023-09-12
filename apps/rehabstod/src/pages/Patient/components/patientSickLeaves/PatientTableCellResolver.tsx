import { DiagnosisInfoCell } from '../../../../components/DiagnosisInfo/DiagnosisInfoCell'
import { RiskSignalInfo } from '../../../../components/SickLeave/RiskSignalInfo'
import { SickLeaveDegreeInfo } from '../../../../components/SickLeave/SickLeaveDegreeInfo'
import { TableCell } from '../../../../components/Table/tableBody/TableCell'
import { PatientSjukfallIntyg } from '../../../../schemas/patientSchema'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { getCertificateColumnData } from '../../utils/getCertificateColumnData'
import { CertificateButton } from '../CertificateButton'
import { OtherUnitInformation } from './OtherUnitInformation'

export function PatientTableCellResolver({
  column,
  list,
  certificate,
}: {
  column: string
  list: PatientSjukfallIntyg[]
  certificate: PatientSjukfallIntyg
}) {
  switch (column) {
    case PatientColumn.Diagnos:
      return <DiagnosisInfoCell diagnosis={certificate.diagnos} biDiagnoses={certificate.bidiagnoser} />
    case PatientColumn.Grad:
      return (
        <TableCell>
          <SickLeaveDegreeInfo degrees={certificate.grader} />
        </TableCell>
      )
    case PatientColumn.Risk:
      return <TableCell>{certificate.riskSignal && <RiskSignalInfo {...certificate.riskSignal} />}</TableCell>
    case PatientColumn.Intyg:
      return certificate ? (
        <TableCell sticky="right">
          {certificate.otherVardgivare || certificate.otherVardenhet ? (
            <OtherUnitInformation />
          ) : (
            <CertificateButton certificateId={certificate.intygsId} />
          )}
        </TableCell>
      ) : (
        <>-</>
      )
    default:
      return (
        <TableCell>
          <span className="whitespace-pre-line">{getCertificateColumnData(column, certificate, list)}</span>
        </TableCell>
      )
  }
}
