import { Checkbox } from '../../../../components/Form/Checkbox'
import { SelectMultiple } from '../../../../components/Form/SelectMultiple'
import { RekoStatusType } from '../../../../schemas/sickLeaveSchema'
import { getRekoStatusPlaceholder } from '../../utils/getRekoStatusPlaceholder'

export function RekoStatusFilter({
  onChange,
  statuses,
  selected,
  description,
}: {
  onChange: (rekoStatuses: string[]) => void
  statuses: RekoStatusType[]
  selected: string[]
  description: string
}) {
  const handleOnChange = (rekoStatusTypeId: string, isAdded: boolean) => {
    let rekoStatusTypeIds
    if (isAdded) {
      rekoStatusTypeIds = selected.slice()
      rekoStatusTypeIds.push(rekoStatusTypeId)
    } else {
      rekoStatusTypeIds = selected.filter((id) => id !== rekoStatusTypeId)
    }

    onChange(rekoStatusTypeIds)
  }

  return (
    <div className="flex-1">
      <SelectMultiple
        label="REKO-status"
        description={description}
        placeholder={getRekoStatusPlaceholder(selected, statuses) ?? 'Välj i listan'}>
        {statuses
          ? statuses.map((rekoStatusType) => (
              <Checkbox
                key={rekoStatusType.id}
                checked={selected.some((id) => id === rekoStatusType.id)}
                label={rekoStatusType.name}
                onChange={(event) => handleOnChange(rekoStatusType.id, event.currentTarget.checked)}
              />
            ))
          : null}
      </SelectMultiple>
    </div>
  )
}
