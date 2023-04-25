import { IDSSpinner } from '@frontend/ids-react-ts'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { DiagnosisDescription } from '../../../components/SickLeave/DiagnosisDescription'
import { DiagnosisInfo } from '../../../components/SickLeave/DiagnosisInfo'
import { EndDateInfo } from '../../../components/SickLeave/EndDateInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { TableCell } from '../../../components/Table/TableCell'
import { SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { SjukfallColumn } from '../../../store/slices/sjukfallTableColumnsSlice'
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
          {showPersonalInformation && <TableCell>{getSickLeavesColumnData(SjukfallColumn.Personnummer, sickLeave)}</TableCell>}
          <TableCell>{getSickLeavesColumnData(SjukfallColumn.Ålder, sickLeave)} år</TableCell>
          {showPersonalInformation && <TableCell>{getSickLeavesColumnData(SjukfallColumn.Namn, sickLeave)}</TableCell>}
          <TableCell>{getSickLeavesColumnData(SjukfallColumn.Kön, sickLeave)}</TableCell>
          <TableCell description={<DiagnosisDescription diagnos={sickLeave.diagnos} biDiagnoser={sickLeave.biDiagnoser} />}>
            <DiagnosisInfo diagnos={sickLeave.diagnos} biDiagnoser={sickLeave.biDiagnoser} />
          </TableCell>
          <TableCell>
            {sickLeave.sysselsattning.map((occupation, index) => (
              <React.Fragment key={occupation}>
                {occupation}
                {index !== sickLeave.sysselsattning.length - 1 ? <br /> : ''}
              </React.Fragment>
            ))}
          </TableCell>
          <TableCell>{getSickLeavesColumnData(SjukfallColumn.Startdatum, sickLeave)}</TableCell>
          <TableCell>
            <EndDateInfo date={sickLeave.slut} isDateAfterToday={isDateBeforeToday(sickLeave.slut)} />
          </TableCell>
          <TableCell>{getSickLeavesColumnData(SjukfallColumn.Längd, sickLeave)} dagar</TableCell>
          <TableCell>{getSickLeavesColumnData(SjukfallColumn.Intyg, sickLeave)}</TableCell>
          <TableCell>
            <SickLeaveDegreeInfo degrees={sickLeave.grader} />
          </TableCell>
          <TableCell>{getSickLeavesColumnData(SjukfallColumn.Läkare, sickLeave)}</TableCell>
        </tr>
      ))}
    </>
  )
}
