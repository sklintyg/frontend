import { SickLeaveDiagnosis } from '../../schemas/sickLeaveSchema'

export function DiagnosisInfo({ diagnos, biDiagnoser }: { diagnos?: SickLeaveDiagnosis; biDiagnoser: SickLeaveDiagnosis[] }) {
  if (!diagnos) {
    return <span>Okänt</span>
  }

  return (
    <span>
      {diagnos.kod} {diagnos.beskrivning}
      {biDiagnoser.length > 0 && `, ${biDiagnoser.map(({ kod }) => kod).join(', ')}`}
    </span>
  )
}
