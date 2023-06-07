import { OccupationType, RekoStatusType } from '../../../schemas/sickLeaveSchema'

export const getMultipleSelectPlaceholder = (selected: string[], options: OccupationType[] | RekoStatusType[]) => {
  if (selected.length === 0 || !selected) {
    return 'Alla valda'
  }

  if (selected.length === 1) {
    const option = options.find((s) => s.id === selected[0])
    return option ? option.name : ''
  }

  return `${selected.length} valda`
}
