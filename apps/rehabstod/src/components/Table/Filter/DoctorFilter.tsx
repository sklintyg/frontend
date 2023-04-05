import { SelectMultiple } from '../../Form/SelectMultiple'
import { Lakare } from '../../../store/types/sickLeave'
import { Checkbox } from '../../Form/Checkbox'

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
    <SelectMultiple
      id="doctorFilter"
      label="Läkare"
      description={description}
      placeholder={getPlaceholder()}
      options={
        doctors
          ? doctors.map((doctor) => (
              <Checkbox
                id={doctor.hsaId}
                key={doctor.hsaId}
                checked={selected.some((id) => id === doctor.hsaId)}
                label={doctor.namn}
                onChange={(event) => handleOnChange(doctor.hsaId, event.currentTarget.checked)}
              />
            ))
          : null
      }
    />
  )
}
