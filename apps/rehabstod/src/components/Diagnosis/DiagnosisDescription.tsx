import { Diagnosis } from '../../schemas/diagnosisSchema'

export function DiagnosisDescription({ diagnosis }: { diagnosis: Diagnosis[] }) {
  return (
    <ul>
      {diagnosis.map(({ kod, beskrivning }) => (
        <li key={kod}>
          {kod} - {beskrivning}
        </li>
      ))}
    </ul>
  )
}
