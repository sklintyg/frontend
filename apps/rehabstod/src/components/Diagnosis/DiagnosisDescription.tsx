import { Diagnosis } from '../../schemas/diagnosisSchema'

export function DiagnosisDescription({ diagnos, biDiagnoser }: { diagnos: Diagnosis; biDiagnoser: Diagnosis[] }) {
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
