import { SelectMultiple, SelectMultipleListBox, SelectMultipleOption } from '@frontend/components'
import { useId } from 'react'
import type { Lakare } from '../../../schemas/lakareSchema'
import { PrintTitle } from '../print/PrintTitle'
import { getDoctorsPlaceholder } from './utils/getDoctorsPlaceholder'

export function DoctorFilter({
  onChange,
  doctors,
  selected,
  description,
}: {
  onChange: (doctorIds: string[]) => void
  doctors: Lakare[]
  selected: string[]
  description: string
}) {
  const listBoxId = useId()
  const LABEL = 'Läkare'

  const handleOnChange = (doctorId: string, isAdded: boolean) => {
    let doctorIds
    if (isAdded) {
      doctorIds = selected.slice()
      doctorIds.push(doctorId)
    } else {
      doctorIds = selected.filter((id) => id !== doctorId)
    }

    onChange(doctorIds)
  }

  return (
    <>
      <div className="flex-1 print:hidden">
        <SelectMultiple
          listBoxId={listBoxId}
          light
          label={LABEL}
          description={description}
          placeholder={getDoctorsPlaceholder(selected, doctors)}
        >
          <SelectMultipleListBox id={listBoxId}>
            {doctors &&
              doctors.map((doctor) => (
                <SelectMultipleOption
                  key={doctor.hsaId}
                  checked={selected.some((id) => id === doctor.hsaId)}
                  label={doctor.namn}
                  onChange={(event) => handleOnChange(doctor.hsaId, event.currentTarget.checked)}
                />
              ))}
          </SelectMultipleListBox>
        </SelectMultiple>
      </div>
      <div className="hidden whitespace-pre-line print:block">
        <PrintTitle title={LABEL} />
        {selected.length === 0
          ? 'Alla valda'
          : doctors.filter((doctor) => selected.find((id) => doctor.hsaId === id)).map((doctor) => `${doctor.namn}\n`)}
      </div>
    </>
  )
}
