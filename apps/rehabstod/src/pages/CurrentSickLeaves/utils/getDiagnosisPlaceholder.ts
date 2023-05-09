import { DiagnosKapitel } from '../../../schemas/sickLeaveSchema'

export const getDiagnosisPlaceholder = (selected: DiagnosKapitel[]) => {
  if (selected.length === 0) {
    return undefined
  }

  if (selected.length === 1) {
    return `${selected[0].id}: ${selected[0].name} `
  }

  return `${selected.length} valda`
}
