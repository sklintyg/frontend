import { SickLeaveDiagnosis } from '../../schemas/sickLeaveSchema'
import { DiagnosisInfo } from '../SickLeave/DiagnosisInfo'

export function DiagnosisCell({ diagnos, biDiagnoser }: { diagnos: SickLeaveDiagnosis; biDiagnoser: SickLeaveDiagnosis[] }) {
  return (
    <td>
      <DiagnosisInfo code={diagnos.kod} description={diagnos.beskrivning} isSubDiagnosis={false} />
      {biDiagnoser.map((diagnosis, index) => (
        <div key={diagnosis.kod}>
          {index > 0 && ','} <DiagnosisInfo code={diagnosis.kod} description={diagnosis.beskrivning} isSubDiagnosis />
        </div>
      ))}
    </td>
  )
}
