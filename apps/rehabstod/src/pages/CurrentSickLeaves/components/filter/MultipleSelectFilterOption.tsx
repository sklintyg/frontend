import { Checkbox } from '../../../../components/Form/Checkbox'
import { SelectMultiple } from '../../../../components/Form/SelectMultiple'
import { OccupationType, RekoStatusType } from '../../../../schemas/sickLeaveSchema'

export function MultipleSelectFilterOption({
  onChange,
  options,
  selected,
  description,
  label,
  placeholder,
}: {
  onChange: (options: string[]) => void
  options: OccupationType[] | RekoStatusType[]
  selected: string[]
  description: string
  label: string
  placeholder: string
}) {
  const handleOnChange = (option: string, isAdded: boolean) => {
    let optionIds
    if (isAdded) {
      optionIds = selected.slice()
      optionIds.push(option)
    } else {
      optionIds = selected.filter((id) => id !== option)
    }

    onChange(optionIds)
  }

  return (
    <div className="flex-1">
      <SelectMultiple label={label} description={description} placeholder={placeholder}>
        {options
          ? options.map((option) => (
              <Checkbox
                key={option.id}
                checked={selected.some((id) => id === option.id)}
                label={option.name}
                onChange={(event) => handleOnChange(option.id, event.currentTarget.checked)}
              />
            ))
          : null}
      </SelectMultiple>
    </div>
  )
}
