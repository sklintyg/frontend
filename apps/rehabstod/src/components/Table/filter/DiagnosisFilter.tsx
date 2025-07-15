import { IDSCheckboxGroup, IDSInput } from '@inera/ids-react'
import { useId, useState } from 'react'
import type { DiagnosKapitel } from '../../../schemas/diagnosisSchema'
import { Divider } from '../../Divider/Divider'
import { Checkbox } from '../../form/Checkbox/Checkbox'
import { SelectMultiple } from '../../form/SelectMultiple/SelectMultiple'
import { PrintTitle } from '../print/PrintTitle'
import { getDiagnosisPlaceholder } from './utils/getDiagnosisPlaceholder'

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
  const id = useId()
  const [search, setSearch] = useState('')
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
        <SelectMultiple id={id} light label="Diagnos" description={description} placeholder={getDiagnosisPlaceholder(selected)}>
          <div className="mb-2">
            <IDSInput>
              <input aria-labelledby={id} type="text" placeholder="Sök diagnos" onChange={(event) => setSearch(event.target.value)} />
            </IDSInput>
          </div>
          <Divider />
          <div className="max-h-96 overflow-auto">
            <IDSCheckboxGroup>
              {allDiagnoses &&
                allDiagnoses
                  .filter(({ name }) => (search !== '' ? name.includes(search) : true))
                  .map((diagnosis) => (
                    <Checkbox
                      key={diagnosis.id ?? diagnosis.name}
                      disabled={!enabledDiagnoses.some((enabledDiagnosis) => diagnosis.id === enabledDiagnosis.id)}
                      checked={selected.some((selectedDiagnosis) => diagnosis.id === selectedDiagnosis.id)}
                      label={diagnosis.id ? `${diagnosis.id}: ${diagnosis.name}` : diagnosis.name}
                      onChange={(event) => handleOnChange(diagnosis, event.currentTarget.checked)}
                    />
                  ))}
            </IDSCheckboxGroup>
          </div>
        </SelectMultiple>
      </div>
      <div className="hidden whitespace-pre-line print:block">
        <PrintTitle title="Diagnos/er" />
        {selected.length === 0 ? 'Alla valda' : selected.map((diagnosisChapter) => `${diagnosisChapter.id}: ${diagnosisChapter.name}\n`)}
      </div>
    </>
  )
}
