import { Gender } from '../../schemas/patientSchema'
import { SummaryDataPoint } from '../../schemas/sickLeaveSchema'

export const getGenderText = (gender?: Gender) => {
  if (!gender) {
    return ''
  }

  return gender === Gender.M ? 'för män' : 'för kvinnor'
}

export const getGraphHeight = (data: SummaryDataPoint[]) => {
  const itemsWithLongName = data.filter((dataPoint) => dataPoint.name.length > 35).length

  return 100 + itemsWithLongName * 60 + (data.length - itemsWithLongName) * 35
}
