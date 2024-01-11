import { getDoctorsPlaceholder } from './utils/getDoctorsPlaceholder'
import { Lakare } from '../../../schemas/lakareSchema'
import { Checkbox } from '../../Form/Checkbox'
import { SelectMultiple } from '../../Form/SelectMultiple/SelectMultiple'
import { SelectMultipleList } from '../../Form/SelectMultiple/SelectMultipleList'
import { PrintTitle } from '../print/PrintTitle'

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
        <SelectMultiple label={LABEL} description={description} placeholder={getDoctorsPlaceholder(selected, doctors)}>
          <SelectMultipleList>
            {doctors &&
              doctors.map((doctor) => (
                <Checkbox
                  key={doctor.hsaId}
                  checked={selected.some((id) => id === doctor.hsaId)}
                  label={doctor.namn}
                  onChange={(event) => handleOnChange(doctor.hsaId, event.currentTarget.checked)}
                />
              ))}
          </SelectMultipleList>
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
