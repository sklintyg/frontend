import { IDSSpinner } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { DiagnosisDescription } from '../../../components/Diagnosis/DiagnosisDescription'
import { DiagnosisInfo } from '../../../components/Diagnosis/DiagnosisInfo'
import { EndDateInfo } from '../../../components/SickLeave/EndDateInfo'
import { RekoStatusDropdown } from '../../../components/SickLeave/RekoStatusDropdown'
import { RiskSignalInfo } from '../../../components/SickLeave/RiskSignalInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { MaxColspanRow } from '../../../components/Table/tableBody/MaxColspanRow'
import { TableCell } from '../../../components/Table/tableBody/TableCell'
import { TableRow } from '../../../components/Table/tableBody/TableRow'
import { getEmptyFiltrationText, getEmptyTableText, getSearchText } from '../../../components/Table/utils/tableTextGeneratorUtils'
import { getUnansweredCommunicationFormat } from '../../../components/UnansweredCommunication/utils/getUnansweredCommunicationFormat'
import { User } from '../../../schemas'
import { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { useGetSickLeavesFiltersQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { allSickLeaveColumns } from '../../../store/slices/sickLeaveTableColumns.selector'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'

function ResolveTableCell({ column, sickLeave, isDoctor }: { column: string; sickLeave: SickLeaveInfo; isDoctor: boolean }) {
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
      return sickLeave.diagnos ? (
        <TableCell description={<DiagnosisDescription diagnos={sickLeave.diagnos} biDiagnoser={sickLeave.biDiagnoser} />}>
          <DiagnosisInfo diagnos={sickLeave.diagnos} biDiagnoser={sickLeave.biDiagnoser} />
        </TableCell>
      ) : (
        <span>Okänt</span>
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
    case SickLeaveColumn.Ärenden:
      return <TableCell>{getUnansweredCommunicationFormat(sickLeave.obesvaradeKompl, sickLeave.unansweredOther)}</TableCell>
    default:
      return null
  }
}

export function TableBodyRows({
  isLoading,
  sickLeaves,
  showPersonalInformation,
  user,
  isDoctor,
}: {
  isLoading: boolean
  showPersonalInformation: boolean
  sickLeaves?: SickLeaveInfo[]
  user?: User
  isDoctor: boolean
}) {
  const navigate = useNavigate()
  const { sortTableList } = useTableContext()
  const columns = useAppSelector(allSickLeaveColumns)
  const { hasAppliedFilters } = useAppSelector((state) => state.sickLeave)
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()

  const TABLE_NAME = 'pågående sjukfall'
  const EMPTY_TEXT = getEmptyTableText(user, TABLE_NAME)
  const SEARCH_TEXT = getSearchText(isDoctor, TABLE_NAME)
  const EMPTY_TEXT_FILTRATION = getEmptyFiltrationText(TABLE_NAME)

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
    return <MaxColspanRow colspan={visibleColumns.length}>{SEARCH_TEXT}</MaxColspanRow>
  }

  if (sickLeaves.length === 0) {
    if (hasAppliedFilters) {
      return <MaxColspanRow colspan={visibleColumns.length}>{EMPTY_TEXT_FILTRATION}</MaxColspanRow>
    }

    return <MaxColspanRow colspan={visibleColumns.length}>{EMPTY_TEXT}</MaxColspanRow>
  }

  const navigateToPatient = (data: SickLeaveInfo) => {
    navigate(`/pagaende-sjukfall/${data.encryptedPatientId}`, {
      state: {
        rekoStatus: data.rekoStatus,
        activeTab: 0,
      },
    })
  }

  return (
    <>
      {sortTableList(sickLeaves, getSickLeavesColumnData).map(
        (sickLeave) =>
          visibleColumns.length > 0 && (
            <TableRow
              key={sickLeave.patient.id}
              italic={isDateBeforeToday(sickLeave.slut)}
              onNavigate={(data) => navigateToPatient(data)}
              data={sickLeave}
              focusable
            >
              {visibleColumns.map(({ name }) => (
                <ResolveTableCell key={name} column={name} sickLeave={sickLeave} isDoctor={isDoctor} />
              ))}
            </TableRow>
          )
      )}
    </>
  )
}
