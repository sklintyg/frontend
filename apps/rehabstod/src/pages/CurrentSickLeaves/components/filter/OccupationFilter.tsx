import { Checkbox } from '../../../../components/Form/Checkbox'
import { SelectMultiple } from '../../../../components/Form/SelectMultiple'
import { OccupationType } from '../../../../schemas/sickLeaveSchema'
import { getOccupationPlaceholder } from '../../utils/getOccupationPlaceholder'

export function OccupationFilter({
  onChange,
  occupations,
  selected,
  description,
}: {
  onChange: (occupations: string[]) => void
  occupations: OccupationType[]
  selected: string[]
  description: string
}) {
  const handleOnChange = (occupationTypeId: string, isAdded: boolean) => {
    let occupationIds
    if (isAdded) {
      occupationIds = selected.slice()
      occupationIds.push(occupationTypeId)
    } else {
      occupationIds = selected.filter((id) => id !== occupationTypeId)
    }

    onChange(occupationIds)
  }

  return (
    <div className="flex-1">
      <SelectMultiple
        label="Sysselsättning"
        description={description}
        placeholder={getOccupationPlaceholder(selected, occupations) ?? 'Välj i listan'}>
        {occupations
          ? occupations.map((occupationType) => (
              <Checkbox
                key={occupationType.id}
                checked={selected.some((id) => id === occupationType.id)}
                label={occupationType.name}
                onChange={(event) => handleOnChange(occupationType.id, event.currentTarget.checked)}
              />
            ))
          : null}
      </SelectMultiple>
    </div>
  )
}
