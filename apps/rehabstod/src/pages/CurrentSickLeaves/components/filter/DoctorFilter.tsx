import { Checkbox } from '../../../../components/Form/Checkbox'
import { SelectMultiple } from '../../../../components/Form/SelectMultiple/SelectMultiple'
import { SelectMultipleList } from '../../../../components/Form/SelectMultiple/SelectMultipleList'
import { Lakare } from '../../../../schemas/lakareSchema'
import { getDoctorsPlaceholder } from '../../utils/getDoctorsPlaceholder'

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
    <div className="flex-1">
      {doctors && (
        <SelectMultiple label="Läkare" description={description} placeholder={getDoctorsPlaceholder(selected, doctors)}>
          <SelectMultipleList>
            {doctors.map((doctor) => (
              <Checkbox
                key={doctor.hsaId}
                checked={selected.some((id) => id === doctor.hsaId)}
                label={doctor.namn}
                onChange={(event) => handleOnChange(doctor.hsaId, event.currentTarget.checked)}
              />
            ))}
          </SelectMultipleList>
        </SelectMultiple>
      )}
    </div>
  )
}
