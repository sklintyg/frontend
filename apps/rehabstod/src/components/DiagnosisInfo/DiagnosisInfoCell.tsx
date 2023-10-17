import { isTruthy } from '@frontend/utils'
import { Diagnosis } from '../../schemas/diagnosisSchema'
import { TableCell } from '../Table/tableBody/TableCell'

export function DiagnosisInfoCell({ diagnosis, biDiagnoses }: { diagnosis?: Diagnosis; biDiagnoses: Diagnosis[] }) {
  const filteredDiagnosis = [diagnosis, ...biDiagnoses].filter(isTruthy)
  return (
    <TableCell
      description={
        filteredDiagnosis.length > 0 ? (
          <ul>
            {filteredDiagnosis.map(({ kod, beskrivning }) => (
              <li key={kod}>
                {kod} - {beskrivning || `Diagnoskod ${kod} är okänd och har ingen beskrivning`}
              </li>
            ))}
          </ul>
        ) : (
          <span>Patienten har valt att inte förmedla diagnos.</span>
        )
      }
    >
      {diagnosis ? (
        <span>
          {diagnosis.kod} {diagnosis.beskrivning}
          {biDiagnoses && biDiagnoses.length > 0 && `, ${biDiagnoses.map(({ kod }) => kod).join(', ')}`}
        </span>
      ) : (
        <span>Okänt</span>
      )}
    </TableCell>
  )
}
