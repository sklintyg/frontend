import { DiagnosisInfoCell } from '../../../components/DiagnosisInfo/DiagnosisInfoCell'
import { EndDateInfo } from '../../../components/SickLeave/EndDateInfo'
import { RekoStatusDropdown } from '../../../components/SickLeave/RekoStatusDropdown'
import { RiskSignalInfo } from '../../../components/SickLeave/RiskSignalInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { TableCell } from '../../../components/Table/tableBody/TableCell'
import { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { getUnansweredCommunicationFormat } from '../../../utils/getUnansweredCommunicationFormat'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
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
    case SickLeaveColumn.Diagnos:
      return <DiagnosisInfoCell diagnosis={sickLeave.diagnos} biDiagnoses={sickLeave.biDiagnoser} />
    case SickLeaveColumn.Slutdatum:
      return (
        <TableCell>
          <EndDateInfo date={sickLeave.slut} isDateAfterToday={isDateBeforeToday(sickLeave.slut)} />
        </TableCell>
      )
    case SickLeaveColumn.Grad:
      return (
        <TableCell>
          <SickLeaveDegreeInfo degrees={sickLeave.grader} activeDegree={sickLeave.aktivGrad} />
        </TableCell>
      )
    case SickLeaveColumn.Status:
      return !isDoctor ? (
        <TableCell>
          <RekoStatusDropdown statusFromSickLeave={sickLeave.rekoStatus} patientId={sickLeave.patient.id} endDate={sickLeave.slut} />
        </TableCell>
      ) : (
        <TableCell>{getSickLeavesColumnData(SickLeaveColumn.Status, sickLeave, sickLeaves)}</TableCell>
      )
    case SickLeaveColumn.Risk:
      return <TableCell>{sickLeave.riskSignal && <RiskSignalInfo {...sickLeave.riskSignal} />}</TableCell>
    case SickLeaveColumn.Ärenden:
      return <TableCell>{getUnansweredCommunicationFormat(sickLeave.obesvaradeKompl, sickLeave.unansweredOther)}</TableCell>
    default:
      return <TableCell>{getSickLeavesColumnData(column, sickLeave, sickLeaves)}</TableCell>
  }
}
