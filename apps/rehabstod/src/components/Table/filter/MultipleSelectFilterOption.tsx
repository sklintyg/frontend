import type { OccupationType, RekoStatusType } from '../../../schemas/sickLeaveSchema'
import { Checkbox } from '../../Form/Checkbox'
import { SelectMultiple } from '../../Form/SelectMultiple/SelectMultiple'
import { SelectMultipleList } from '../../Form/SelectMultiple/SelectMultipleList'
import { PrintTitle } from '../print/PrintTitle'

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
          <SelectMultipleList>
            {options &&
              options.map((option) => (
                <Checkbox
                  key={option.id}
                  checked={selected.some((id) => id === option.id)}
                  label={option.name}
                  onChange={(event) => handleOnChange(option.id, event.currentTarget.checked)}
                />
              ))}
          </SelectMultipleList>
        </SelectMultiple>
      </div>
      <div className="hidden whitespace-pre-line print:block">
        <PrintTitle title={label} />
        {selected.length === 0
          ? 'Alla valda'
          : options.filter((type) => selected.find((id) => type.id === id)).map((type) => `${type.name}\n`)}
      </div>
    </>
  )
}
