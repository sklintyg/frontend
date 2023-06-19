import { DiagnosKapitel } from '../../../schemas/diagnosisSchema'

export const getDiagnosisPlaceholder = (selected: DiagnosKapitel[]) => {
  if (selected.length === 0 || !selected) {
    return 'Alla valda'
  }

  if (selected.length === 1) {
    return `${selected[0].id}: ${selected[0].name} `
  }

  return `${selected.length} valda`
}
