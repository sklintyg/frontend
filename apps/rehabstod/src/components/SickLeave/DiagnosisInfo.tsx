import { Diagnosis } from '../../schemas/diagnosisSchema'

export function DiagnosisInfo({ diagnos, biDiagnoser }: { diagnos?: Diagnosis; biDiagnoser: Diagnosis[] }) {
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
