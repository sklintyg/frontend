import { IDSSpinner } from '@frontend/ids-react-ts'
import { SickLeaveColumn, SickLeaveInfo } from '../../../store/types/sickLeave'
import { getColumnData } from '../utils/getColumnData'
import { DiagnosisInfo } from './DiagnosisInfo'
import { MaxColspanRow } from './MaxColspanRow'
import { SickLeaveDegreeInfo } from './SickLeaveDegreeInfo'

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
  const EMPTY_TEXT_DOCTOR = `Du har inga pågående sjukfall på ${unitId}`
  const SEARCH_TEXT_DOCTOR =
    'Tryck på Sök för att visa alla dina pågående sjukfall för enheten, eller ange filterval och tryck på Sök för att visa urval av dina pågående sjukfall.'
  const EMPTY_TEXT_REHABCOORDINATOR = `Det finns inga pågående sjukfall på ${unitId}`
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

  return (
    <>
      {sickLeaves.map((sickLeave) => (
        <tr key={`${sickLeave.patient.id}${sickLeave.diagnos.kod}${sickLeave.start}${sickLeave.slut}`}>
          {showPersonalInformation && <td>{getColumnData(SickLeaveColumn.Personnummer, sickLeave)}</td>}
          <td>{getColumnData(SickLeaveColumn.Ålder, sickLeave)}</td>
          {showPersonalInformation && <td>{getColumnData(SickLeaveColumn.Namn, sickLeave)}</td>}
          <td>{getColumnData(SickLeaveColumn.Kön, sickLeave)}</td>
          <td>
            <DiagnosisInfo code={sickLeave.diagnos.kod} description={sickLeave.diagnos.beskrivning} isSubDiagnosis={false} />
            {sickLeave.biDiagnoser.map((diagnosis, index) => (
              <>
                {index > 0 && ','} <DiagnosisInfo code={diagnosis.kod} description={diagnosis.beskrivning} isSubDiagnosis />
              </>
            ))}
          </td>
          <td>{getColumnData(SickLeaveColumn.Startdatum, sickLeave)}</td>
          <td>{getColumnData(SickLeaveColumn.Slutdatum, sickLeave)}</td>
          <td>{getColumnData(SickLeaveColumn.Längd, sickLeave)}</td>
          <td>{getColumnData(SickLeaveColumn.Intyg, sickLeave)}</td>
          <td>
            <SickLeaveDegreeInfo degrees={sickLeave.grader} />
          </td>
          <td>{getColumnData(SickLeaveColumn.Läkare, sickLeave)}</td>
        </tr>
      ))}
    </>
  )
}
