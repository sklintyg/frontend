import { Divider, Input, SelectMultiple, SelectMultipleListBox, SelectMultipleOption } from '@frontend/components'
import { useId, useState } from 'react'
import type { DiagnosKapitel } from '../../../schemas/diagnosisSchema'
import { PrintTitle } from '../print/PrintTitle'
import { getDiagnosisPlaceholder } from './utils/getDiagnosisPlaceholder'

function getDiagnosisLabel({ id, name }: DiagnosKapitel) {
  return id ? `${id}: ${name}` : name
}

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
  const listBoxId = useId()
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
        <SelectMultiple
          id={id}
          light
          label="Diagnos"
          description={description}
          placeholder={getDiagnosisPlaceholder(selected)}
          listBoxId={listBoxId}
        >
          <div className="mb-2">
            <Input
              label=""
              aria-labelledby={id}
              type="text"
              placeholder="Sök diagnos"
              onChange={(event) => setSearch(event.target.value.toLowerCase())}
            />
          </div>
          <Divider />
          <div className="max-h-96 overflow-auto">
            <SelectMultipleListBox id={listBoxId}>
              {allDiagnoses &&
                allDiagnoses
                  .filter((diagnosis) => (search !== '' ? getDiagnosisLabel(diagnosis).toLowerCase().includes(search) : true))
                  .map((diagnosis) => (
                    <SelectMultipleOption
                      key={diagnosis.id ?? diagnosis.name}
                      disabled={!enabledDiagnoses.some((enabledDiagnosis) => diagnosis.id === enabledDiagnosis.id)}
                      checked={selected.some((selectedDiagnosis) => diagnosis.id === selectedDiagnosis.id)}
                      label={getDiagnosisLabel(diagnosis)}
                      onChange={(event) => handleOnChange(diagnosis, event.currentTarget.checked)}
                    />
                  ))}
            </SelectMultipleListBox>
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
