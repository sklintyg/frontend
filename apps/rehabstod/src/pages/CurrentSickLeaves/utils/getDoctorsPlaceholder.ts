import { Lakare } from '../../../schemas/lakareSchema'

export const getDoctorsPlaceholder = (selected: string[], doctors: Lakare[]) => {
  if (selected.length === 0) {
    return undefined
  }

  if (selected.length === 1) {
    const doctor = doctors.find((d) => d.hsaId === selected[0])
    return doctor ? doctor.namn : ''
  }

  return `${selected.length} valda`
}
