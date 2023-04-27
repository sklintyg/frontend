import { DiagnosKapitel } from '../../../schemas/sickLeaveSchema'
import { Checkbox } from '../../Form/Checkbox'
import { SelectMultiple } from '../../Form/SelectMultiple'

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
  const getPlaceholder = () => {
    if (selected.length === 0) {
      return 'Välj i listan'
    }

    if (selected.length === 1) {
      return `${selected[0].id}: ${selected[0].name} `
    }

    return `${selected.length} valda`
  }

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
      <SelectMultiple
        label="Diagnos"
        description={description}
        placeholder={getPlaceholder()}
        options={
          allDiagnoses
            ? allDiagnoses.map((diagnosis) => (
                <Checkbox
                  key={diagnosis.id ?? diagnosis.name}
                  disabled={!enabledDiagnoses.some((enabledDiagnosis) => diagnosis.id === enabledDiagnosis.id)}
                  checked={selected.some((selectedDiagnosis) => diagnosis.id === selectedDiagnosis.id)}
                  label={diagnosis.id ? `${diagnosis.id}: ${diagnosis.name}` : diagnosis.name}
                  onChange={(event) => handleOnChange(diagnosis, event.currentTarget.checked)}
                />
              ))
            : null
        }
      />
    </div>
  )
}
