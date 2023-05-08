import { Checkbox } from '../../../../components/Form/Checkbox'
import { SelectMultiple } from '../../../../components/Form/SelectMultiple'
import { Lakare } from '../../../../schemas/lakareSchema'

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
  const getPlaceholder = () => {
    if (selected.length === 0) {
      return 'Välj i listan'
    }

    if (selected.length === 1) {
      const doctor = doctors.find((d) => d.hsaId === selected[0])
      return doctor ? doctor.namn : ''
    }

    return `${selected.length} valda`
  }

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
      <SelectMultiple label="Läkare" description={description} placeholder={getPlaceholder()}>
        {doctors
          ? doctors.map((doctor) => (
              <Checkbox
                key={doctor.hsaId}
                checked={selected.some((id) => id === doctor.hsaId)}
                label={doctor.namn}
                onChange={(event) => handleOnChange(doctor.hsaId, event.currentTarget.checked)}
              />
            ))
          : null}
      </SelectMultiple>
    </div>
  )
}
