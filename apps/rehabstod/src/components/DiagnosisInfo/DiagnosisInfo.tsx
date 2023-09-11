import { Diagnosis } from '../../schemas/diagnosisSchema'

export function DiagnosisInfo({ diagnosis, biDiagnoses }: { diagnosis?: Diagnosis; biDiagnoses: Diagnosis[] }) {
  return diagnosis ? (
    <span>
      {diagnosis.kod} {diagnosis.beskrivning}
      {biDiagnoses && biDiagnoses.length > 0 && `, ${biDiagnoses.map(({ kod }) => kod).join(', ')}`}
    </span>
  ) : (
    <span>Okänt</span>
  )
}
