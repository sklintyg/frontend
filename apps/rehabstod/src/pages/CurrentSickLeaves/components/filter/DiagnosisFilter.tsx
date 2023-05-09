import { Checkbox } from '../../../../components/Form/Checkbox'
import { SelectMultiple } from '../../../../components/Form/SelectMultiple'
import { DiagnosKapitel } from '../../../../schemas/sickLeaveSchema'
import { getDiagnosisPlaceholder } from '../../utils/getDiagnosisPlaceholder'

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
    <div className="flex-1">
      <SelectMultiple label="Diagnos" description={description} placeholder={getDiagnosisPlaceholder(selected) ?? 'Välj i listan'}>
        {allDiagnoses
          ? allDiagnoses.map((diagnosis) => (
              <Checkbox
                key={diagnosis.id ?? diagnosis.name}
                disabled={!enabledDiagnoses.some((enabledDiagnosis) => diagnosis.id === enabledDiagnosis.id)}
                checked={selected.some((selectedDiagnosis) => diagnosis.id === selectedDiagnosis.id)}
                label={diagnosis.id ? `${diagnosis.id}: ${diagnosis.name}` : diagnosis.name}
                onChange={(event) => handleOnChange(diagnosis, event.currentTarget.checked)}
              />
            ))
          : null}
      </SelectMultiple>
    </div>
  )
}
