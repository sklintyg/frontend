import { DiagnosisInfo } from '../../../components/SickLeave/DiagnosisInfo'
import { EndDateInfo } from '../../../components/SickLeave/EndDateInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { RiskSignal, SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { useAppSelector } from '../../../store/hooks'
import { allSickLeaveColumns } from '../../../store/slices/sickLeaveTableColumns.selector'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'
import { UnansweredCommunicationInfo } from '../../../components/SickLeave/UnansweredCommunicationInfo'

function resolveRisk(riskSignal: RiskSignal) {
  if (!riskSignal) {
    return ''
  }

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

function ResolveTableCell({ column, sickLeave }: { column: string; sickLeave: SickLeaveInfo }) {
  switch (column) {
    case SickLeaveColumn.Personnummer:
      return <>{getSickLeavesColumnData(SickLeaveColumn.Personnummer, sickLeave)}</>
    case SickLeaveColumn.Ålder:
      return <>{getSickLeavesColumnData(SickLeaveColumn.Ålder, sickLeave)} år</>
    case SickLeaveColumn.Namn:
      return <>{getSickLeavesColumnData(SickLeaveColumn.Namn, sickLeave)}</>
    case SickLeaveColumn.Kön:
      return <>{getSickLeavesColumnData(SickLeaveColumn.Kön, sickLeave)}</>
    case SickLeaveColumn.Diagnos:
      return sickLeave.diagnos ? <DiagnosisInfo diagnos={sickLeave.diagnos} biDiagnoser={sickLeave.biDiagnoser} /> : <>Okänt</>
    case SickLeaveColumn.Sysselsättning:
      return <>{getSickLeavesColumnData(SickLeaveColumn.Sysselsättning, sickLeave)}</>
    case SickLeaveColumn.Startdatum:
      return <>{getSickLeavesColumnData(SickLeaveColumn.Startdatum, sickLeave)}</>
    case SickLeaveColumn.Slutdatum:
      return <EndDateInfo date={sickLeave.slut} isDateAfterToday={isDateBeforeToday(sickLeave.slut)} />
    case SickLeaveColumn.Längd:
      return <>{getSickLeavesColumnData(SickLeaveColumn.Längd, sickLeave)} dagar</>
    case SickLeaveColumn.Intyg:
      return <>{getSickLeavesColumnData(SickLeaveColumn.Intyg, sickLeave)}</>
    case SickLeaveColumn.Grad:
      return <SickLeaveDegreeInfo degrees={sickLeave.grader} />
    case SickLeaveColumn.Läkare:
      return <>{getSickLeavesColumnData(SickLeaveColumn.Läkare, sickLeave)}</>
    case SickLeaveColumn.RekoStatus:
      return <>{getSickLeavesColumnData(SickLeaveColumn.RekoStatus, sickLeave)}</>
    case SickLeaveColumn.Risk:
      return <>{resolveRisk(sickLeave.riskSignal)}</>
    case SickLeaveColumn.Ärenden:
      return <UnansweredCommunicationInfo complements={sickLeave.obesvaradeKompl} others={sickLeave.unansweredOther} />
    default:
      return null
  }
}

export function PrintTable({ sickLeaves, showPersonalInformation }: { sickLeaves?: SickLeaveInfo[]; showPersonalInformation: boolean }) {
  const { sortTableList } = useTableContext()
  const columns = useAppSelector(allSickLeaveColumns)

  if (!sickLeaves) {
    return null
  }
  return (
    <div>
      {sortTableList(sickLeaves, getSickLeavesColumnData)?.map((sickLeave) => (
        <div key={sickLeave.patient.id} className="border-neutral-40 -mb-px columns-3 break-inside-avoid gap-2 border p-4">
          {columns
            .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Personnummer))
            .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Namn))
            .map(
              ({ name, visible }) =>
                visible && (
                  <div key={name} className="flex gap-1">
                    <div className="w-5/12 font-bold">{name}:</div>
                    <div key={name} className="w-7/12 overflow-hidden text-ellipsis whitespace-normal">
                      <ResolveTableCell column={name} sickLeave={sickLeave} />
                    </div>
                  </div>
                )
            )}
        </div>
      ))}
    </div>
  )
}
