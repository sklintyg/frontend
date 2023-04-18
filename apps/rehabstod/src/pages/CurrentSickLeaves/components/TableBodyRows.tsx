import { IDSSpinner } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { EndDateInfo } from '../../../components/SickLeave/EndDateInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { DiagnosisCell } from '../../../components/Table/DiagnosisCell'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { SickLeaveColumn, SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
import { getSickLeavesColumnData } from '../utils/getSickLeavesColumnData'
import { MaxColspanRow } from './MaxColspanRow'

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

  const EMPTY_TEXT_DOCTOR = `Du har inga pågående sjukfall på ${unitId}`
  const SEARCH_TEXT_DOCTOR =
    'Tryck på Sök för att visa alla dina pågående sjukfall för enheten, eller ange filterval och tryck på Sök för att visa urval av dina pågående sjukfall.'
  const EMPTY_TEXT_REHABCOORDINATOR = `Det finns inga pågående sjukfall på ${unitId}.`
  const SEARCH_TEXT_REHABCOORDINATOR =
    'Tryck på Sök för att visa alla pågående sjukfall för enheten, eller ange filterval och tryck på Sök för att visa urval av pågående sjukfall.'

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
    return <MaxColspanRow>{isDoctor ? EMPTY_TEXT_DOCTOR : EMPTY_TEXT_REHABCOORDINATOR}</MaxColspanRow>
  }

  const navigateToPatient = (id: string) => {
    navigate(`/pagaende-sjukfall/${btoa(id.replace('-', ''))}`)
  }

  return (
    <>
      {sortTableList(sickLeaves, getSickLeavesColumnData).map((sickLeave) => (
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
          {showPersonalInformation && <td>{getSickLeavesColumnData(SickLeaveColumn.Personnummer, sickLeave)}</td>}
          <td>{getSickLeavesColumnData(SickLeaveColumn.Ålder, sickLeave)} år</td>
          {showPersonalInformation && <td>{getSickLeavesColumnData(SickLeaveColumn.Namn, sickLeave)}</td>}
          <td>{getSickLeavesColumnData(SickLeaveColumn.Kön, sickLeave)}</td>
          <DiagnosisCell diagnos={sickLeave.diagnos} biDiagnoser={sickLeave.biDiagnoser} />
          <td>{getSickLeavesColumnData(SickLeaveColumn.Startdatum, sickLeave)}</td>
          <td>
            <EndDateInfo date={sickLeave.slut} isDateAfterToday={isDateBeforeToday(sickLeave.slut)} />
          </td>
          <td>{getSickLeavesColumnData(SickLeaveColumn.Längd, sickLeave)} dagar</td>
          <td>{getSickLeavesColumnData(SickLeaveColumn.Intyg, sickLeave)}</td>
          <td>
            <SickLeaveDegreeInfo degrees={sickLeave.grader} />
          </td>
          <td>{getSickLeavesColumnData(SickLeaveColumn.Läkare, sickLeave)}</td>
        </tr>
      ))}
    </>
  )
}
