import { DiagnosisInfo } from '../../../components/DiagnosisInfo/DiagnosisInfo'
import { EndDateInfo } from '../../../components/SickLeave/EndDateInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { RiskSignal, SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { getUnansweredCommunicationFormat } from '../../../utils/getUnansweredCommunicationFormat'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'
import { TableCell } from '../../../components/Table/tableBody/TableCell'

function resolveRisk(riskSignal: RiskSignal) {
  if (riskSignal.riskKategori === 1) {
    return 'Måttlig'
  }

  if (riskSignal.riskKategori === 2) {
    return 'Hög'
  }

  if (riskSignal.riskKategori === 3) {
    return 'Mycket hög'
  }

  return 'Ej beräknad'
}

export function ResolvePrintTableCell({
  column,
  sickLeave,
  sickLeaves,
}: {
  column: string
  sickLeave: SickLeaveInfo
  sickLeaves: SickLeaveInfo[]
}) {
  switch (column) {
    case SickLeaveColumn.Diagnos:
      return sickLeave.diagnos ? <DiagnosisInfo diagnosis={sickLeave.diagnos} biDiagnoses={sickLeave.biDiagnoser} /> : <>Okänt</>
    case SickLeaveColumn.Slutdatum:
      return <EndDateInfo date={sickLeave.slut} isDateAfterToday={isDateBeforeToday(sickLeave.slut)} />
    case SickLeaveColumn.Grad:
      return <SickLeaveDegreeInfo degrees={sickLeave.grader} />
    case SickLeaveColumn.Risk:
      return <div>{sickLeave.riskSignal && resolveRisk(sickLeave.riskSignal)}</div>
    case SickLeaveColumn.Ärenden:
      return <>{getUnansweredCommunicationFormat(sickLeave.obesvaradeKompl, sickLeave.unansweredOther)}</>
    case SickLeaveColumn.Ålder:
      return <TableCell>{getSickLeavesColumnData(column, sickLeave)} år</TableCell>
    case SickLeaveColumn.Längd:
      return <TableCell>{getSickLeavesColumnData(column, sickLeave)} dagar</TableCell>
    default:
      return <>{getSickLeavesColumnData(column, sickLeave, sickLeaves)}</>
  }
}
