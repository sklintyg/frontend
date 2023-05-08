import { IDSSpinner } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { DiagnosisDescription } from '../../../components/SickLeave/DiagnosisDescription'
import { DiagnosisInfo } from '../../../components/SickLeave/DiagnosisInfo'
import { EndDateInfo } from '../../../components/SickLeave/EndDateInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { TableCell } from '../../../components/Table/TableCell'
import { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { useAppSelector } from '../../../store/hooks'
import { allSickLeaveColumns } from '../../../store/slices/sickLeaveTableColumns.selector'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'
import { MaxColspanRow } from './MaxColspanRow'

function ResolveTableCell({ column, sickLeave }: { column: string; sickLeave: SickLeaveInfo }) {
  switch (column) {
    case SickLeaveColumn.Personnummer:
      return <TableCell>{getSickLeavesColumnData(SickLeaveColumn.Personnummer, sickLeave)}</TableCell>
    case SickLeaveColumn.Ålder:
      return <TableCell>{getSickLeavesColumnData(SickLeaveColumn.Ålder, sickLeave)} år</TableCell>
    case SickLeaveColumn.Namn:
      return <TableCell>{getSickLeavesColumnData(SickLeaveColumn.Namn, sickLeave)}</TableCell>
    case SickLeaveColumn.Kön:
      return <TableCell>{getSickLeavesColumnData(SickLeaveColumn.Kön, sickLeave)}</TableCell>
    case SickLeaveColumn.Diagnos:
      return (
        <TableCell description={<DiagnosisDescription diagnos={sickLeave.diagnos} biDiagnoser={sickLeave.biDiagnoser} />}>
          <DiagnosisInfo diagnos={sickLeave.diagnos} biDiagnoser={sickLeave.biDiagnoser} />
        </TableCell>
      )
    case SickLeaveColumn.Sysselsättning:
      return <TableCell>{getSickLeavesColumnData(SickLeaveColumn.Sysselsättning, sickLeave)}</TableCell>
    case SickLeaveColumn.Startdatum:
      return <TableCell>{getSickLeavesColumnData(SickLeaveColumn.Startdatum, sickLeave)}</TableCell>
    case SickLeaveColumn.Slutdatum:
      return (
        <TableCell>
          <EndDateInfo date={sickLeave.slut} isDateAfterToday={isDateBeforeToday(sickLeave.slut)} />
        </TableCell>
      )
    case SickLeaveColumn.Längd:
      return <TableCell>{getSickLeavesColumnData(SickLeaveColumn.Längd, sickLeave)} dagar</TableCell>
    case SickLeaveColumn.Intyg:
      return <TableCell>{getSickLeavesColumnData(SickLeaveColumn.Intyg, sickLeave)}</TableCell>
    case SickLeaveColumn.Grad:
      return (
        <TableCell>
          <SickLeaveDegreeInfo degrees={sickLeave.grader} />
        </TableCell>
      )
    case SickLeaveColumn.Läkare:
      return <TableCell>{getSickLeavesColumnData(SickLeaveColumn.Läkare, sickLeave)}</TableCell>
    default:
      return null
  }
}

export function TableBodyRows({
  isLoading,
  sickLeaves,
  showPersonalInformation,
  unitId,
  isDoctor,
}: {
  isLoading: boolean
  showPersonalInformation: boolean
  sickLeaves?: SickLeaveInfo[]
  unitId: string
  isDoctor: boolean
}) {
  const navigate = useNavigate()
  const { sortTableList } = useTableContext()
  const columns = useAppSelector(allSickLeaveColumns)
  const { hasAppliedFilters } = useAppSelector((state) => state.sickLeave)

  const EMPTY_TEXT_DOCTOR = `Du har inga pågående sjukfall på ${unitId}.`
  const SEARCH_TEXT_DOCTOR =
    'Tryck på Sök för att visa alla dina pågående sjukfall för enheten, eller ange filterval och tryck på Sök för att visa urval av dina pågående sjukfall.'
  const EMPTY_TEXT_REHABCOORDINATOR = `Det finns inga pågående sjukfall på ${unitId}.`
  const SEARCH_TEXT_REHABCOORDINATOR =
    'Tryck på Sök för att visa alla pågående sjukfall för enheten, eller ange filterval och tryck på Sök för att visa urval av pågående sjukfall.'
  const EMPTY_TEXT_FILTRATION = 'Inga sjukfall matchade filtreringen.'

  if (isLoading) {
    return (
      <MaxColspanRow>
        <IDSSpinner />
      </MaxColspanRow>
    )
  }

  if (sickLeaves == null) {
    return <MaxColspanRow>{isDoctor ? SEARCH_TEXT_DOCTOR : SEARCH_TEXT_REHABCOORDINATOR}</MaxColspanRow>
  }

  if (sickLeaves.length === 0) {
    if (hasAppliedFilters) {
      return <MaxColspanRow>{EMPTY_TEXT_FILTRATION}</MaxColspanRow>
    }

    return <MaxColspanRow>{isDoctor ? EMPTY_TEXT_DOCTOR : EMPTY_TEXT_REHABCOORDINATOR}</MaxColspanRow>
  }

  const navigateToPatient = (id: string) => {
    navigate(`/pagaende-sjukfall/${btoa(id.replace('-', ''))}`)
  }

  return (
    <>
      {sortTableList(sickLeaves, getSickLeavesColumnData).map(
        (sickLeave) =>
          columns.length > 0 && (
            <tr
              tabIndex={0}
              onKeyDown={({ code, currentTarget }) => {
                if (['Enter', 'Space'].includes(code)) {
                  navigateToPatient(sickLeave.patient.id)
                }
                if (code === 'ArrowUp' && currentTarget.previousElementSibling) {
                  ;(currentTarget.previousElementSibling as HTMLElement).focus()
                }
                if (code === 'ArrowDown' && currentTarget.nextElementSibling) {
                  ;(currentTarget.nextElementSibling as HTMLElement).focus()
                }
              }}
              onClick={() => navigateToPatient(sickLeave.patient.id)}
              key={sickLeave.patient.id}
              className={`hover:scale-100 hover:cursor-pointer hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] ${
                isDateBeforeToday(sickLeave.slut) ? 'italic' : ''
              }`}>
              {columns
                .filter(({ visible }) => visible)
                .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Personnummer))
                .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Namn))
                .map(({ name }) => (
                  <ResolveTableCell key={name} column={name} sickLeave={sickLeave} />
                ))}
            </tr>
          )
      )}
    </>
  )
}
