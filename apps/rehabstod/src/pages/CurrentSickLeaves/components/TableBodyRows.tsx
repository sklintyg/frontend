import { IDSSpinner } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { DiagnosisDescription } from '../../../components/SickLeave/DiagnosisDescription'
import { DiagnosisInfo } from '../../../components/SickLeave/DiagnosisInfo'
import { EndDateInfo } from '../../../components/SickLeave/EndDateInfo'
import { RekoStatusDropdown } from '../../../components/SickLeave/RekoStatusDropdown'
import { RiskSignalInfo } from '../../../components/SickLeave/RiskSignalInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { TableCell } from '../../../components/Table/TableCell'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { useGetPopulatedFiltersQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { allSickLeaveColumns } from '../../../store/slices/sickLeaveTableColumns.selector'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'
import { MaxColspanRow } from './MaxColspanRow'

function ResolveTableCell({ column, sickLeave, isDoctor }: { column: string; sickLeave: SickLeaveInfo; isDoctor: boolean }) {
  switch (column) {
    case SickLeaveColumn.Diagnos:
      return sickLeave.diagnos ? (
        <TableCell description={<DiagnosisDescription diagnos={sickLeave.diagnos} biDiagnoser={sickLeave.biDiagnoser} />}>
          <DiagnosisInfo diagnos={sickLeave.diagnos} biDiagnoser={sickLeave.biDiagnoser} />
        </TableCell>
      ) : (
        <span>Okänt</span>
      )
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
        <TableCell>{getSickLeavesColumnData(SickLeaveColumn.RekoStatus, sickLeave)}</TableCell>
      )
    case SickLeaveColumn.Risk:
      return (
        <TableCell>
          <RiskSignalInfo riskSignal={sickLeave.riskSignal} />
        </TableCell>
      )
    default:
      return <TableCell>{getSickLeavesColumnData(column, sickLeave)}</TableCell>
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
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()

  const EMPTY_TEXT_DOCTOR = `Du har inga pågående sjukfall på ${unitId}.`
  const SEARCH_TEXT_DOCTOR =
    'Tryck på Sök för att visa alla dina pågående sjukfall för enheten, eller ange filterval och tryck på Sök för att visa urval av dina pågående sjukfall.'
  const EMPTY_TEXT_REHABCOORDINATOR = `Det finns inga pågående sjukfall på ${unitId}.`
  const SEARCH_TEXT_REHABCOORDINATOR =
    'Tryck på Sök för att visa alla pågående sjukfall för enheten, eller ange filterval och tryck på Sök för att visa urval av pågående sjukfall.'
  const EMPTY_TEXT_FILTRATION = 'Inga sjukfall matchade filtreringen.'

  const visibleColumns = columns
    .filter(({ visible }) => visible)
    .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Personnummer))
    .filter(({ name }) => !(showPersonalInformation === false && name === SickLeaveColumn.Namn))
    .filter(({ name }) => !(isDoctor && name === SickLeaveColumn.Läkare))
    .filter(({ name }) => !(!populatedFilters?.srsActivated && name === SickLeaveColumn.Risk))

  if (isLoading) {
    return (
      <MaxColspanRow colspan={visibleColumns.length}>
        <IDSSpinner />
      </MaxColspanRow>
    )
  }

  if (sickLeaves == null) {
    return <MaxColspanRow colspan={visibleColumns.length}>{isDoctor ? SEARCH_TEXT_DOCTOR : SEARCH_TEXT_REHABCOORDINATOR}</MaxColspanRow>
  }

  if (sickLeaves.length === 0) {
    if (hasAppliedFilters) {
      return <MaxColspanRow colspan={visibleColumns.length}>{EMPTY_TEXT_FILTRATION}</MaxColspanRow>
    }

    return <MaxColspanRow colspan={visibleColumns.length}>{isDoctor ? EMPTY_TEXT_DOCTOR : EMPTY_TEXT_REHABCOORDINATOR}</MaxColspanRow>
  }

  const navigateToPatient = (id: string) => {
    navigate(`/pagaende-sjukfall/${id}`)
  }

  return (
    <>
      {sortTableList(sickLeaves, getSickLeavesColumnData).map(
        (sickLeave) =>
          visibleColumns.length > 0 && (
            <tr
              tabIndex={0}
              onKeyDown={({ code, currentTarget }) => {
                if (['Enter', 'Space'].includes(code)) {
                  navigateToPatient(sickLeave.encryptedPatientId)
                }
                if (code === 'ArrowUp' && currentTarget.previousElementSibling) {
                  ;(currentTarget.previousElementSibling as HTMLElement).focus()
                }
                if (code === 'ArrowDown' && currentTarget.nextElementSibling) {
                  ;(currentTarget.nextElementSibling as HTMLElement).focus()
                }
              }}
              onClick={() => navigateToPatient(sickLeave.encryptedPatientId)}
              key={sickLeave.patient.id}
              className={`hover:scale-100 hover:cursor-pointer hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] ${
                isDateBeforeToday(sickLeave.slut) ? 'italic' : ''
              }`}
            >
              {visibleColumns.map(({ name }) => (
                <ResolveTableCell key={name} column={name} sickLeave={sickLeave} isDoctor={isDoctor} />
              ))}
            </tr>
          )
      )}
    </>
  )
}
