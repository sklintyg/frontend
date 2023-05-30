import { RekoStatusType } from '../../../schemas/sickLeaveSchema'

export const getRekoStatusPlaceholder = (selected: string[], statuses: RekoStatusType[]) => {
  if (selected.length === 0) {
    return undefined
  }

  if (selected.length === 1) {
    const status = statuses.find((s) => s.id === selected[0])
    return status ? status.name : ''
  }

  return `${selected.length} valda`
}
