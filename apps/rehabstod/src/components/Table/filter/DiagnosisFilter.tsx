import { getDiagnosisPlaceholder } from './utils/getDiagnosisPlaceholder'
import { DiagnosKapitel } from '../../../schemas/diagnosisSchema'
import { Checkbox } from '../../Form/Checkbox'
import { SelectMultiple } from '../../Form/SelectMultiple/SelectMultiple'
import { SelectMultipleList } from '../../Form/SelectMultiple/SelectMultipleList'
import { PrintTitle } from '../print/PrintTitle'

export function DiagnosisFilter({
  onChange,
  allDiagnoses,
  enabledDiagnoses,
  selected,
  description,
}: {
  onChange: (diagnoses: DiagnosKapitel[]) => void
  allDiagnoses: DiagnosKapitel[]
  enabledDiagnoses: DiagnosKapitel[]
  selected: DiagnosKapitel[]
  description: string
}) {
  const handleOnChange = (diagnosis: DiagnosKapitel, isAdded: boolean) => {
    let diagnoses
    if (isAdded) {
      diagnoses = selected.slice()
      diagnoses.push(diagnosis)
    } else {
      diagnoses = selected.filter((selectedDiagnosis) => diagnosis.id !== selectedDiagnosis.id)
    }

    onChange(diagnoses)
  }

  return (
    <>
      <div className="flex-1 print:hidden">
        <SelectMultiple label="Diagnos" description={description} placeholder={getDiagnosisPlaceholder(selected)}>
          <SelectMultipleList>
            {allDiagnoses &&
              allDiagnoses.map((diagnosis) => (
                <Checkbox
                  key={diagnosis.id ?? diagnosis.name}
                  disabled={!enabledDiagnoses.some((enabledDiagnosis) => diagnosis.id === enabledDiagnosis.id)}
                  checked={selected.some((selectedDiagnosis) => diagnosis.id === selectedDiagnosis.id)}
                  label={diagnosis.id ? `${diagnosis.id}: ${diagnosis.name}` : diagnosis.name}
                  onChange={(event) => handleOnChange(diagnosis, event.currentTarget.checked)}
                />
              ))}
          </SelectMultipleList>
        </SelectMultiple>
      </div>
      <div className="hidden whitespace-pre-line print:block">
        <PrintTitle title="Diagnos/er" />
        {selected.length === 0 ? 'Alla valda' : selected.map((diagnosisChapter) => `${diagnosisChapter.id}: ${diagnosisChapter.name}\n`)}
      </div>
    </>
  )
}
