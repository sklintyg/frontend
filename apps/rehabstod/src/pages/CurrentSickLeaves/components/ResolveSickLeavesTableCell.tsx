import { DiagnosisDescription } from '../../../components/Diagnosis/DiagnosisDescription'
import { DiagnosisInfo } from '../../../components/Diagnosis/DiagnosisInfo'
import { EndDateInfo } from '../../../components/SickLeave/EndDateInfo'
import { RekoStatusDropdown } from '../../../components/SickLeave/RekoStatusDropdown'
import { RiskSignalInfo } from '../../../components/SickLeave/RiskSignalInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { TableCell } from '../../../components/Table/tableBody/TableCell'
import { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { getUnansweredCommunicationFormat } from '../../../utils/getUnansweredCommunicationFormat'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
import { isTruthy } from '../../../utils/isTruthy'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'

export function ResolveSickLeavesTableCell({
  column,
  sickLeave,
  isDoctor,
  sickLeaves,
}: {
  column: string
  sickLeave: SickLeaveInfo
  isDoctor: boolean
  sickLeaves: SickLeaveInfo[]
}) {
  switch (column) {
    case SickLeaveColumn.Diagnos: {
      const diagnosis = [sickLeave.diagnos, ...sickLeave.biDiagnoser].filter(isTruthy)
      return sickLeave.diagnos ? (
        <TableCell description={diagnosis.length > 0 && <DiagnosisDescription diagnosis={diagnosis} />}>
          <DiagnosisInfo diagnos={sickLeave.diagnos} biDiagnoser={sickLeave.biDiagnoser} />
        </TableCell>
      ) : (
        <span>Okänt</span>
      )
    }
    case SickLeaveColumn.Slutdatum:
      return (
        <TableCell>
          <EndDateInfo date={sickLeave.slut} isDateAfterToday={isDateBeforeToday(sickLeave.slut)} />
        </TableCell>
      )
    case SickLeaveColumn.Grad:
      return (
        <TableCell>
          <SickLeaveDegreeInfo degrees={sickLeave.grader} />
        </TableCell>
      )
    case SickLeaveColumn.RekoStatus:
      return !isDoctor ? (
        <TableCell>
          <RekoStatusDropdown statusFromSickLeave={sickLeave.rekoStatus} patientId={sickLeave.patient.id} endDate={sickLeave.slut} />
        </TableCell>
      ) : (
        <TableCell>{getSickLeavesColumnData(SickLeaveColumn.RekoStatus, sickLeave, sickLeaves)}</TableCell>
      )
    case SickLeaveColumn.Risk:
      return <TableCell>{sickLeave.riskSignal && <RiskSignalInfo {...sickLeave.riskSignal} />}</TableCell>
    case SickLeaveColumn.Ärenden:
      return <TableCell>{getUnansweredCommunicationFormat(sickLeave.obesvaradeKompl, sickLeave.unansweredOther)}</TableCell>
    default:
      return <TableCell>{getSickLeavesColumnData(column, sickLeave, sickLeaves)}</TableCell>
  }
}
