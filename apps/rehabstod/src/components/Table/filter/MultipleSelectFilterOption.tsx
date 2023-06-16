import { Checkbox } from '../../Form/Checkbox'
import { SelectMultiple } from '../../Form/SelectMultiple'
import { OccupationType, RekoStatusType } from '../../../schemas/sickLeaveSchema'

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
    <>
      <div className="flex-1 print:hidden">
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
      <div className="hidden whitespace-pre-line print:block">
        <p className="font-bold">{label}: </p>
        {selected.length === 0
          ? 'Alla valda'
          : options.filter((type) => selected.find((id) => type.id === id)).map((type) => `${type.name}\n`)}
      </div>
    </>
  )
}
