import type { Diagnosis } from '../../schemas/diagnosisSchema'

export function DiagnosisInfo({ diagnosis, biDiagnoses }: { diagnosis?: Diagnosis; biDiagnoses?: Diagnosis[] }) {
  return diagnosis ? (
    <div className="inline-flex w-full whitespace-nowrap">
      <span className="truncate">
        {diagnosis.kod} {diagnosis.beskrivning}
      </span>
      {biDiagnoses && biDiagnoses.length > 0 && <span>{biDiagnoses.map(({ kod }) => kod).join(', ')}</span>}
    </div>
  ) : (
    <span>Okänt</span>
  )
}
