import { SickLeaveDiagnosis } from '../../schemas/sickLeaveSchema'

export function DiagnosisDescription({ diagnos, biDiagnoser }: { diagnos: SickLeaveDiagnosis; biDiagnoser: SickLeaveDiagnosis[] }) {
  if (!diagnos) {
    return null
  }

  return (
    <ul>
      {[diagnos].concat(biDiagnoser).map(({ kod, beskrivning }) => (
        <li key={kod}>
          {kod} - {beskrivning}
        </li>
      ))}
    </ul>
  )
}
