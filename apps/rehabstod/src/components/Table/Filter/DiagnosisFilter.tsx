import { SelectMultiple } from '../../Form/SelectMultiple'
import { DiagnosKapitel } from '../../../store/types/sickLeave'
import { Checkbox } from '../../Form/Checkbox'

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
        id="doctorFilter"
        label="Diagnos"
        description={description}
        placeholder={getPlaceholder()}
        options={
          allDiagnoses
            ? allDiagnoses.map((diagnosis) => (
                <Checkbox
                  id={diagnosis.id ? diagnosis.id : diagnosis.name}
                  key={diagnosis.id ? diagnosis.id : diagnosis.name}
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
