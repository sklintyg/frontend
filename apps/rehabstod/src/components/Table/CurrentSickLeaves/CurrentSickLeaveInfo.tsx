import { CURRENT_SICK_LEAVES_TABLE_HEADERS } from '../../../utils/listUtils'
import { SickLeaveInfo } from '../../../store/types/sickLeave'
import { DiagnosisInfo } from './DiagnosisInfo'

export function CurrentSickLeaveInfo({ sickLeave, header }: { sickLeave: SickLeaveInfo; header: string }) {
  const getSickLeaveContent = () => {
    switch (header) {
      case CURRENT_SICK_LEAVES_TABLE_HEADERS[0]:
        return sickLeave.patient.id
      case CURRENT_SICK_LEAVES_TABLE_HEADERS[1]:
        return sickLeave.patient.alder
      case CURRENT_SICK_LEAVES_TABLE_HEADERS[2]:
        return sickLeave.patient.namn
      case CURRENT_SICK_LEAVES_TABLE_HEADERS[3]:
        return sickLeave.patient.kon === 'F' ? 'Kvinna' : 'Man'
      case CURRENT_SICK_LEAVES_TABLE_HEADERS[4]:
        return (
          <div>
            <DiagnosisInfo code={sickLeave.diagnos.kod} description={sickLeave.diagnos.beskrivning} isSubDiagnosis={false} />
            {sickLeave.biDiagnoser.map((diagnosis, index) => (
              <>
                {index > 0 && ','} <DiagnosisInfo code={diagnosis.kod} description={diagnosis.beskrivning} isSubDiagnosis />
              </>
            ))}
          </div>
        )
      case CURRENT_SICK_LEAVES_TABLE_HEADERS[5]:
        return sickLeave.start
      case CURRENT_SICK_LEAVES_TABLE_HEADERS[6]:
        return sickLeave.slut
      case CURRENT_SICK_LEAVES_TABLE_HEADERS[7]:
        return sickLeave.dagar
      case CURRENT_SICK_LEAVES_TABLE_HEADERS[8]:
        return sickLeave.intyg
      case CURRENT_SICK_LEAVES_TABLE_HEADERS[9]:
        return `${sickLeave.aktivGrad}%`
      case CURRENT_SICK_LEAVES_TABLE_HEADERS[10]:
        return sickLeave.lakare.namn
      default:
        return ''
    }
  }

  return <td>{getSickLeaveContent()}</td>
}
