import { OccupationType } from '../../../schemas/sickLeaveSchema'

export const getOccupationPlaceholder = (selected: string[], occupationTypes: OccupationType[]) => {
  if (selected.length === 0) {
    return 'Alla valda'
  }

  if (selected.length === 1) {
    const occupation = occupationTypes.find((s) => s.id === selected[0])
    return occupation ? occupation.name : ''
  }

  return `${selected.length} valda`
}
